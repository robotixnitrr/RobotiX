import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Improved error interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            // Only redirect if not already on login page to prevent loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        // Return a more detailed error message
        return Promise.reject({
            message: error.response?.data?.message || error.message || 'An error occurred',
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

export const authApi = {
    register: async (userData: { 
        email: string; 
        password: string; 
        name: string; 
        age: number; 
        phone: string; 
    }) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string; }) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },

    checkAuth: async () => {
        const response = await axiosInstance.get('/auth/check');
        return response.data;
    }
}; 