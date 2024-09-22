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
        // 用户登录
        async login(userData, router) {
            try {
                const response = await axiosInstance.post('/auth', userData);
                this.token = response.data.token;
                this.headers['blade-auth'] = response.data.token;

                // 更新 localStorage
                localStorage.setItem('token', this.token);

                // 更新 Axios 实例的头部
                axiosInstance.defaults.headers['blade-auth'] = this.token;

                ElMessage({
                    message: '登录成功',
                    type: 'success'
                });

                // 跳转到主页
                router.push('/');
            } catch (error) {
                console.error(error);

                ElMessage({
                    message: '登录失败',
                    type: 'error'
                });
            }
        },
        // 用户登出
        logout(router) {
            this.token = null;
            this.user = null;
            this.headers['blade-auth'] = null;

            // 清除 localStorage
            localStorage.removeItem('token');

            // 清除 Axios 实例的头部
            delete axiosInstance.defaults.headers['blade-auth'];

            // 跳转到登录页面
            router.push('/login');
        },
    },
    persist: {
        enabled: true,  // 开启持久化
        strategies: [
            {
                key: 'user-store',  // 存储到 localStorage 中的 key
                storage: localStorage,  // 使用 localStorage，也可以选择 sessionStorage
            },
        ],
    },
});