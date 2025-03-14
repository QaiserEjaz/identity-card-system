import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://identity-card-system-backend.up.railway.app/api',
    // baseURL:'http://localhost:5000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add retry logic
api.interceptors.response.use(null, async error => {
    if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 5;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return api.request(error.config);
    }
    return Promise.reject(error);
});

export default api;