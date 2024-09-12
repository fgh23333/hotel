import { createRouter, createWebHashHistory } from 'vue-router';
import loginView from '@/views/loginView.vue';
import Dashboard from '@/views/Dashboard.vue';
import RoomManagement from '@/components/RoomManagement.vue';
import BookingManagement from '@/components/BookingManagement.vue';
import CustomerCheckIn from '@/components/CustomerCheckIn.vue';
import FinancialManagement from '@/components/FinancialManagement.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Dashboard },
        { path: '/rooms', component: RoomManagement },
        { path: '/bookings', component: BookingManagement },
        { path: '/check-ins', component: CustomerCheckIn },
        { path: '/financials', component: FinancialManagement },
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
    const token = localStorage.getItem('login')

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