import { authApi } from '../api/authApi';
import { getErrorMessage } from '../utils/apiErrorHandler';

export const authService = {
    register: async (email: string, password: string, name: string, age: number, phone: string) => {
        try {
            const response = await authApi.register({
                email,
                password,
                name,
                age,
                phone
            });
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                return response;
            }
            throw new Error('Registration failed: No user data received');
        } catch (error) {
            localStorage.removeItem('user');
            throw getErrorMessage(error);
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                return response;
            }
            throw new Error('Login failed: No user data received');
        } catch (error) {
            localStorage.removeItem('user');
            throw getErrorMessage(error);
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw getErrorMessage(error);
        }
    },

    checkAuth: async () => {
        try {
            const response = await authApi.checkAuth();
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
                return response;
            }
            throw new Error('Auth check failed: No user data received');
        } catch (error) {
            localStorage.removeItem('user');
            throw error;
        }
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    }
}; 