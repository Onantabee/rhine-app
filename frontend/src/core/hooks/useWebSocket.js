import { useEffect, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { getApiBaseUrl } from "../config/env";
import { useDispatch } from "react-redux";
import { updateApi } from "../../features/update/api/updateApi";
import projectsApi from "../../features/project/api/projectsApi";
import { tasksApi } from "../../features/task/api/tasksApi";
import { clearActiveProject } from "../../features/project/store/projectSlice";

export default function useWebSocket(projectId, userEmail) {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const dispatch = useDispatch();

  const connect = useCallback(() => {
    const baseUrl = getApiBaseUrl();
    const brokerURL = baseUrl.replace(/^http/, 'ws') + '/ws';

    const stompClient = new Client({
      brokerURL,
      debug: (str) => console.log("[WebSocket Debug]", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("WebSocket connected. User:", userEmail, "Project:", projectId);
        setIsConnected(true);
        setConnectionError(null);
        setClient(stompClient);

        stompClient.subscribe("/topic/comments", (message) => {
          try {
            const newComment = JSON.parse(message.body);
            setMessages((prev) => [...prev, newComment]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        stompClient.subscribe("/topic/comment-update", (message) => {
          try {
            const updatedComment = JSON.parse(message.body);
            setMessages((prev) => [...prev, updatedComment]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        stompClient.subscribe("/topic/task-created", (task) => {
          try {
            const newTask = JSON.parse(task.body).payload;
            setTasks((prev) => [...prev, newTask]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        stompClient.subscribe("/topic/task-deleted", (task) => {
          try {
            const deletedId = JSON.parse(task.body).payload;
            setTasks((prev) => [...prev, { id: deletedId, deleted: true }]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        });

        stompClient.subscribe("/topic/task-updated", (task) => {
          try {
            const updatedTask = JSON.parse(task.body).payload;
            setTasks((prev) => [...prev, updatedTask]);
          } catch (error) {
            console.error("Error parsing task update:", error);
          }
        });

        stompClient.subscribe("/topic/task-status-updated", (task) => {
          try {
            const updatedTaskStatus = JSON.parse(task.body).payload;
            setTasks((prev) => [...prev, updatedTaskStatus]);
          } catch (error) {
            console.error("Error parsing task update:", error);
          }
        });

        if (projectId) {
          const membersTopic = `/topic/project/${projectId}/members`;
          console.log("Subscribing to members topic:", membersTopic);
          stompClient.subscribe(membersTopic, (message) => {
            console.log("Received member update broadcast:", message.body);
            dispatch(projectsApi.util.invalidateTags([{ type: 'ProjectMember', id: projectId }]));
            
            if (message.body && String(message.body).includes("MEMBER_REMOVED")) {
               console.log("Member removed detected. Invalidating tasks...");
               dispatch(tasksApi.util.invalidateTags([{ type: 'Task' }]));
            }
          });
        }

        if (projectId && userEmail) {
          const updateTopic = `/topic/project/${projectId}/updates/${userEmail}`;
          stompClient.subscribe(updateTopic, (message) => {
            try {
              const newUpdate = JSON.parse(message.body);
              console.log("Received realtime project update:", newUpdate);
              
              dispatch(
                updateApi.util.updateQueryData('getProjectUpdates', String(projectId), (draft) => {
                  draft.unshift(newUpdate);
                })
              );
            } catch (error) {
              console.error("Error parsing project update:", error);
            }
          });
        }

        if (userEmail) {
          const evictionTopic = `/topic/user/${userEmail}/eviction`;
          console.log("Subscribing to eviction topic:", evictionTopic);
          stompClient.subscribe(evictionTopic, (message) => {
            try {
              const evictedProjectId = message.body;
              console.log("Received eviction notice for project ID:", evictedProjectId);
              
              dispatch(projectsApi.util.invalidateTags([{ type: 'Project' }]));
              
              if (String(evictedProjectId) === String(projectId)) {
                console.log("This is the current project. Clearing active state and invalidating tags.");
                dispatch(clearActiveProject());
                dispatch(updateApi.util.invalidateTags([{ type: 'Update', id: `PROJECT_${evictedProjectId}` }]));
                dispatch(tasksApi.util.invalidateTags([{ type: 'Task' }]));
                dispatch(projectsApi.util.invalidateTags([{ type: 'Project', id: evictedProjectId }]));
              }
            } catch (error) {
              console.error("Error handling eviction notice:", error);
            }
          });
        }
      },

      onStompError: (frame) => {
        const errorMsg = frame.headers["message"] || "Unknown STOMP error";
        console.error("WebSocket Broker reported error:", errorMsg);
        setConnectionError(errorMsg);
      },

      onWebSocketError: (error) => {
        console.error("WebSocket connection error:", error);
        setConnectionError("WebSocket connection error");
      },

      onDisconnect: () => {
        setIsConnected(false);
        setClient(null);
        console.log("Disconnected from WebSocket");
      },
    });

    stompClient.activate();
    return stompClient;
  }, [dispatch, projectId, userEmail]);

  useEffect(() => {
    const stompClient = connect();

    return () => {
      if (stompClient) {
        console.log("Deactivating WebSocket client...");
        stompClient.deactivate();
      }
    };
  }, [connect]);

  return {
    messages,
    tasks,
    client,
    isConnected,
    error: connectionError,
    reconnect: connect,
  };
}
