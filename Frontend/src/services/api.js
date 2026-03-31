import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let csrfToken;
let csrfRequest;

async function fetchCsrfToken() {
  // Development: use fixed token
  if (import.meta.env.DEV) {
    return 'development-token';
  }
  
  if (csrfToken) {
    console.log('Using cached CSRF token:', csrfToken);
    return csrfToken;
  }
  if (!csrfRequest) {
    console.log('Fetching new CSRF token from:', `${API_BASE_URL}/csrf-token`);
    csrfRequest = axios
      .get(`${API_BASE_URL}/csrf-token`, { withCredentials: true })
      .then((response) => {
        csrfToken = response.data.csrfToken;
        console.log('CSRF token fetched successfully:', csrfToken);
        csrfRequest = null;
        return csrfToken;
      })
      .catch((error) => {
        console.error('Error fetching CSRF token:', error);
        csrfRequest = null;
        throw error;
      });
  }
  return csrfRequest;
}

apiClient.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    const method = (config.method || 'get').toLowerCase();
    if (!['get', 'head', 'options'].includes(method)) {
      const token = await fetchCsrfToken();
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function setAuthHeader(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export async function getCsrfToken() {
  return fetchCsrfToken();
}

export default apiClient;

