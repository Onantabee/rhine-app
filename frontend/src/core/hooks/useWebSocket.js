export default function useWebSocket(projectId, userEmail) {
  return {
    messages: [],
    tasks: [],
    client: null,
    isConnected: true,
    error: null,
    reconnect: () => {},
  };
}
