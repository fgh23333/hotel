import homeView from "@/views/homeView.vue";
import loginView from "@/views/loginView.vue";
import userManage from "@/views/userManage.vue"
import orderManage from "@/views/orderManage.vue"
import productManage from "@/views/productManage.vue"
import truckManage from "@/views/truckManage.vue"
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from '../store/index.js';
import employeeManage from "@/views/employeeManage.vue";
import goodsManage from "@/views/goodsManage.vue"
import warehouseManage from "@/views/warehouseManage.vue"
import recipientManage from "@/views/recipientManage.vue"

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
                },
                {
                    path: 'employeeManage',
                    component: employeeManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'goodsManage',
                    component: goodsManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'warehouseManage',
                    component: warehouseManage,
                    meta: { requiresAuth: true }
                },
                {
                    path: 'recipientManage',
                    component: recipientManage,
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
            path: '/:catchAll(.*)',
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