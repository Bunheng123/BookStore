export const API_BASE_URL = "http://localhost:8000"; // point at the PHP dev server (no trailing slash)
export const BACKEND_URL = "http://localhost:8000"; // same here

// Helper to construct URLs (strip any stray slashes)
export const getApiUrl = (endpoint) =>
  `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
export const getBackendUrl = (path) =>
  `${BACKEND_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
