import homeView from "@/views/homeView.vue";
import loginView from "@/views/loginView.vue";
import userManage from "@/views/userManage.vue"
import orderManage from "@/views/orderManage.vue"
import productManage from "@/views/productManage.vue"
import truckManage from "@/views/truckManage.vue"
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from '../store/index.js';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: homeView,
            component: homeView,
            meta: { requiresAuth: true },
            children: [
                {
                    path: "userManage",
                    component: userManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: "orderManage",
                    component: orderManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'productManage',
                    component: productManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'truckManage',
                    component: truckManage,
                    meta: { requiresAuth: true }
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
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;