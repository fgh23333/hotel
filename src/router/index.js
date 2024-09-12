import homeView from "@/views/homeView.vue";
import loginView from "@/views/loginView.vue";
import userManage from "@/views/userManage.vue"
import orderManage from "@/views/orderManage.vue"
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from '../store/index.js';
import staffManage from "@/views/staffManage.vue";
import withdrawManage from "@/views/withdrawManage.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: homeView,
            component: homeView,
            children: [
                {
                    path: "userManage",
                    component: userManage,
                    meta: { requiresAuth: true, roles: ['admin', 'editor'] }
                },
                {
                    path: "orderManage",
                    component: orderManage,
                    meta: { requiresAuth: true, roles: ['admin', 'editor'] }
                },
                {
                    path: 'staffManage',
                    component: staffManage,
                    meta: { requiresAuth: true, roles: ['admin'] }
                },
                {
                    path: 'withdrawManage',
                    component: withdrawManage,
                    meta: { requiresAuth: true, roles: ['admin'] }
                }
            ]
        },
        {
            path: "/login",
            component: loginView,
            name: 'Login'
        },
        {
            path: '/:catchAll(.*)', // 捕获所有未匹配的路由
            redirect: '/login'
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth) {
        if (!authStore.token) {
            next('/login');
        } else if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
            // 如果用户角色不匹配
            next({ name: 'homeView' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;