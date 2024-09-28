import axiosInstance from '@/utils/axiosInstance';
import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: null,
        headers: {
            'blade-auth': null
        }
    }),
    actions: {
        async login(userData, router) {
            try {
                const response = await axiosInstance.post('/auth', userData);
                this.token = response.data.token;
                this.headers['blade-auth'] = response.data.token;

                localStorage.setItem('token', this.token);

                axiosInstance.defaults.headers['blade-auth'] = this.token;

                ElMessage({
                    message: '登录成功',
                    type: 'success'
                });

                router.push('/');
            } catch (error) {
                console.error(error);

                ElMessage({
                    message: '登录失败',
                    type: 'error'
                });
            }
        },
        logout(router) {
            this.token = null;
            this.user = null;
            this.headers['blade-auth'] = null;

            localStorage.removeItem('token');

            delete axiosInstance.defaults.headers['blade-auth'];

            router.push('/login');
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user-store',
                storage: localStorage,
            },
        ],
    },
});