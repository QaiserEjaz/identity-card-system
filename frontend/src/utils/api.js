import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000
});

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