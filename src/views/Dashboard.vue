<template>
    <el-container>
        <el-header>主面板</el-header>
        <el-main>
            <el-row :gutter="20">
                <!-- 房间管理 -->
                <el-col :span="6">
                    <RoomManagement :rooms="rooms" />
                </el-col>

                <!-- 预订管理 -->
                <el-col :span="6">
                    <BookingManagement :bookings="bookings" />
                </el-col>

                <!-- 客户入住 -->
                <el-col :span="6">
                    <CustomerCheckIn :availableRooms="availableRooms" />
                </el-col>

                <!-- 财务管理 -->
                <el-col :span="6">
                    <FinancialManagement :financeStats="financeStats" />
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import RoomManagement from '@/components/RoomManagement.vue';
import BookingManagement from '@/components/BookingManagement.vue';
import CustomerCheckIn from '@/components/CustomerCheckIn.vue';
import FinancialManagement from '@/components/FinancialManagement.vue';

export default {
    components: {
        RoomManagement,
        BookingManagement,
        CustomerCheckIn,
        FinancialManagement
    },
    data() {
        return {
            rooms: [
                { roomNumber: '101', type: '单人间', price: 300, status: '空闲' },
                { roomNumber: '102', type: '单人间', price: 300, status: '已入住' },
                { roomNumber: '103', type: '双人间', price: 400, status: '空闲' },
                { roomNumber: '201', type: '豪华单人间', price: 500, status: '空闲' },
                { roomNumber: '202', type: '双人间', price: 400, status: '已预订' },
                { roomNumber: '203', type: '双人间', price: 400, status: '已入住' }
            ],
            bookings: [
                { customerName: '张三', roomNumber: '202', bookingDate: '2024-09-15', status: '已预订' },
                { customerName: '李四', roomNumber: '103', bookingDate: '2024-09-16', status: '已预订' }
            ],
            availableRooms: [
                { roomNumber: '101' },
                { roomNumber: '103' },
                { roomNumber: '201' }
            ],
            financeStats: {
                todayIncome: 8000,
                monthIncome: 150000,
                pendingAmount: 12000,
                totalIncome: 160000
            }
        };
    }
};
</script>