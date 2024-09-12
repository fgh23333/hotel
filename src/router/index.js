import homeView from "@/views/homeView.vue";
import loginView from "@/views/loginView.vue";
import userManage from "@/views/userManage.vue"
import orderManage from "@/views/orderManage.vue"
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from '../store/index.js';
import staffManage from "@/views/staffManage.vue";

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
                    meta: { requiresAuth: true}
                },
                {
                    path: "orderManage",
                    component: orderManage,
                    meta: { requiresAuth: true}
                },
                {
                    path: 'staffManage',
                    component: staffManage,
                    meta: { requiresAuth: true}
                },
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
    const token = localStorage.getItem(token)
    console.log(token);
    
    if (to.meta.requiresAuth) {
        if (!token) {
            next('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;