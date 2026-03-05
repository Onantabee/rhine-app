import { Client } from '@stomp/stompjs';
import { tasksApi } from '../../features/task/api/tasksApi';
import { commentsApi } from '../../features/task/api/commentsApi';
import { updateApi } from '../../features/update/api/updateApi';
import { getApiBaseUrl } from '../config/env';

let stompClient = null;
let currentSubscriptions = {};
let lastProjectId = null;
let lastUserEmail = null;

export const websocketMiddleware = (store) => (next) => (action) => {
    if (!stompClient) {
        initializeWebSocket(store);
    }
    
    const result = next(action);
    
    if (stompClient && stompClient.connected) {
        handleDynamicSubscriptions(store);
    }

    return result;
};

function handleDynamicSubscriptions(store) {
    const state = store.getState();
    const userEmail = state.auth?.userEmail;
    const projectId = state.project?.activeProject?.id;

    if (userEmail && projectId) {

        if (lastProjectId !== projectId || lastUserEmail !== userEmail) {

            Object.values(currentSubscriptions).forEach(sub => sub.unsubscribe());
            currentSubscriptions = {};
            
            console.log(`[WebSocket] Subscribing to dynamic topics for project ${projectId}`);

            const updateTopic = `/topic/project/${projectId}/updates/${userEmail}`;
            currentSubscriptions[updateTopic] = stompClient.subscribe(updateTopic, (message) => {
                logStompMessage(`project-update-${projectId}`, message.body, '🔔');
                try {
                    const newUpdate = JSON.parse(message.body);
                    store.dispatch(
                        updateApi.util.updateQueryData('getProjectUpdates', projectId, (draft) => {
                            draft.unshift(newUpdate);
                        })
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing project update:', error);
                }
            });

            const membersTopic = `/topic/project/${projectId}/members`;
            currentSubscriptions[membersTopic] = stompClient.subscribe(membersTopic, (message) => {
                logStompMessage(`project-members-${projectId}`, message.body, '👥');
                store.dispatch(
                    tasksApi.util.invalidateTags([{ type: 'ProjectMember', id: projectId }])
                );
            });

            lastProjectId = projectId;
            lastUserEmail = userEmail;
        }
    } else {
        if (Object.keys(currentSubscriptions).length > 0) {
            console.log('[WebSocket] Clearing dynamic project subscriptions');
            Object.values(currentSubscriptions).forEach(sub => sub.unsubscribe());
            currentSubscriptions = {};
            lastProjectId = null;
            lastUserEmail = null;
        }
    }
}

function logStompMessage(topic, body) {
    try {
        const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
        console.groupCollapsed(
            `%c[WebSocket] ${topic}`,
            'color: #14B8A6; font-weight: bold;'
        );
        console.log('Topic:', topic);
        console.log('Payload:', parsedBody);
        console.groupEnd();
    } catch (e) {
        console.log(`[WebSocket] ${topic}:`, body);
    }
}

function initializeWebSocket(store) {
    const apiBaseUrl = getApiBaseUrl();

    const protocol = apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
    const brokerURL = `${protocol}://${apiBaseUrl.replace(/^https?:\/\//, '')}/ws`;

    stompClient = new Client({
        brokerURL,
        debug: (str) => {
            if (str.includes('PONG') || str.includes('PING')) return;
            console.log('%c[WebSocket] STOMP Frame:', 'color: #888; font-style: italic;', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            console.log('%c[WebSocket] Connected', 'color: #14B8A6; font-weight: bold; font-size: 1.1em;');
            
            handleDynamicSubscriptions(store);

            stompClient.subscribe('/topic/unread-updates', (message) => {
                logStompMessage('/topic/unread-updates', message.body);
                try {
                    const { taskId, recipientEmail } = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([
                            { type: 'UnreadCount', id: `${String(taskId)}-${recipientEmail}` },
                            { type: 'Comment', id: 'RECIPIENT' },
                        ])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing unread update:', error);
                }
            });

            stompClient.subscribe('/topic/comments', (message) => {
                logStompMessage('/topic/comments', message.body);
                try {
                    const newComment = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([{ type: 'Comment', id: String(newComment.taskId) }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing comment:', error);
                }
            });

            stompClient.subscribe('/topic/comment-update', (message) => {
                logStompMessage('/topic/comment-update', message.body);
                try {
                    const updatedComment = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([{ type: 'Comment', id: String(updatedComment.taskId) }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing comment update:', error);
                }
            });

            stompClient.subscribe('/topic/comment-deletion', (message) => {
                logStompMessage('/topic/comment-deletion', message.body, '🔴');
                try {
                    const data = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([{ type: 'Comment', id: String(data.taskId) }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing comment deletion:', error);
                }
            });

            stompClient.subscribe('/topic/task-created', (message) => {
                logStompMessage('/topic/task-created', message.body, '🆕');
                try {
                    store.dispatch(
                        tasksApi.util.invalidateTags([{ type: 'Task', id: 'LIST' }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing task created:', error);
                }
            });

            stompClient.subscribe('/topic/task-deleted', (message) => {
                logStompMessage('/topic/task-deleted', message.body, '🗑️');
                try {
                    store.dispatch(
                        tasksApi.util.invalidateTags([{ type: 'Task', id: 'LIST' }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing task deleted:', error);
                }
            });

            stompClient.subscribe('/topic/task-updated', (message) => {
                logStompMessage('/topic/task-updated', message.body, '📝');
                try {
                    const updatedTask = JSON.parse(message.body);
                    const taskId = updatedTask.payload?.id;
                    if (taskId) {
                        store.dispatch(
                            tasksApi.util.invalidateTags([
                                { type: 'Task', id: taskId },
                                { type: 'Task', id: 'LIST' },
                            ])
                        );
                    }
                } catch (error) {
                    console.error('[WebSocket] Error parsing task update:', error);
                }
            });

            stompClient.subscribe('/topic/task-status-updated', (message) => {
                logStompMessage('/topic/task-status-updated', message.body, '🔄');
                try {
                    const data = JSON.parse(message.body);
                    const taskId = data.payload?.id;
                    if (taskId) {
                        store.dispatch(
                            tasksApi.util.invalidateTags([{ type: 'Task', id: taskId }])
                        );
                    }
                } catch (error) {
                    console.error('[WebSocket] Error parsing task status update:', error);
                }
            });
        },

        onStompError: (frame) => {
            console.error('[WebSocket] Broker error:', frame.headers['message']);
        },

        onWebSocketError: (error) => {
            console.error('[WebSocket] Connection error:', error);
        },

        onDisconnect: () => {
            console.log('[WebSocket] Disconnected');
        },
    });

    stompClient.activate();
}

export const getStompClient = () => stompClient;
