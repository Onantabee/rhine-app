import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { tasksApi } from '../api/tasksApi';
import { commentsApi } from '../api/commentsApi';

let stompClient = null;

export const websocketMiddleware = (store) => (next) => (action) => {
    if (!stompClient) {
        initializeWebSocket(store);
    }

    return next(action);
};

function initializeWebSocket(store) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const socket = new SockJS(baseUrl + '/ws');


    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('[WebSocket]', str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
            console.log('[WebSocket] Connected');

            stompClient.subscribe('/topic/unread-updates', (message) => {
                try {
                    const { taskId, recipientEmail } = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([
                            { type: 'UnreadCount', id: `${taskId}-${recipientEmail}` },
                        ])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing unread update:', error);
                }
            });

            stompClient.subscribe('/topic/comments', (message) => {
                try {
                    const newComment = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([{ type: 'Comment', id: newComment.taskId }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing comment:', error);
                }
            });

            stompClient.subscribe('/topic/comment-update', (message) => {
                try {
                    const updatedComment = JSON.parse(message.body);
                    store.dispatch(
                        commentsApi.util.invalidateTags([{ type: 'Comment', id: updatedComment.taskId }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing comment update:', error);
                }
            });

            stompClient.subscribe('/topic/task-created', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    store.dispatch(
                        tasksApi.util.invalidateTags([{ type: 'Task', id: 'LIST' }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing task created:', error);
                }
            });

            stompClient.subscribe('/topic/task-deleted', (message) => {
                try {
                    const data = JSON.parse(message.body);
                    store.dispatch(
                        tasksApi.util.invalidateTags([{ type: 'Task', id: 'LIST' }])
                    );
                } catch (error) {
                    console.error('[WebSocket] Error parsing task deleted:', error);
                }
            });

            stompClient.subscribe('/topic/task-updated', (message) => {
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
