import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        login: null
    }),
    actions: {},
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