export const getApiBaseUrl = () => {
    const envUrl = window.__env__?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
    if (envUrl) return envUrl;
    return `${window.location.protocol}//${window.location.hostname}:8080`;
};
