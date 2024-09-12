<template>
    <el-container>
        <el-header>客户入住</el-header>
        <el-main>
            <el-form :model="checkInForm" label-width="120px">
                <el-form-item label="顾客姓名">
                    <el-input v-model="checkInForm.customerName"></el-input>
                </el-form-item>
                <el-form-item label="房间号">
                    <el-select v-model="checkInForm.roomNumber" placeholder="请选择房间">
                        <el-option v-for="room in availableRooms" :key="room.roomNumber" :label="room.roomNumber"
                            :value="room.roomNumber"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入住日期">
                    <el-date-picker v-model="checkInForm.checkInDate" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-button type="primary" @click="checkIn">入住</el-button>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
export default {
    props: {
        availableRooms: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            checkInForm: {
                customerName: '',
                roomNumber: '',
                checkInDate: ''
            }
        };
    },
    methods: {
        checkIn() {
            // 处理入住逻辑
            console.log(this.checkInForm);
        }
    }
};
</script>