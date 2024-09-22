<template>
    <div id="orderManage">
        <div class="manageCover">
            <h2 class="manageTitle">订单管理</h2>
            <el-form :model="form" label-width="100px" class="order-form">
                <el-form-item label="客户">
                    <el-input v-model="form.customer" placeholder="请输入客户姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" placeholder="选择状态">
                        <el-option label="待处理" value="pending"></el-option>
                        <el-option label="已完成" value="completed"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加订单</el-button>
                </el-form-item>
            </el-form>
            <div class="manageTable">
                <el-table :data="tableData" border>
                    <el-table-column prop="id" label="订单ID" width="100"></el-table-column>
                    <el-table-column prop="customer" label="客户"></el-table-column>
                    <el-table-column prop="date" label="日期"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template #default="scope">
                            <el-tag :type="statusType(scope.row.status)">{{ status[scope.row.status] }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="handleComplete(scope.row)" v-if="scope.row.status === 'pending'">完成订单</el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-if="scope.row.status === 'pending'">取消订单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import axiosInstance from '@/utils/axiosInstance';

export default {
    data() {
        return {
            tableData: [],
            form: {
                customer: '',
                date: '',
                status: ''
            },
            status: {
                'pending': '待处理',
                'completed': '已完成',
                'cancelled': '已取消'
            }
        }
    },
    methods: {
        async handleAdd() {
            if (!this.form.customer || !this.form.date || !this.form.status) {
                ElMessage.warning('客户、日期和状态为必填项');
                return;
            }

            try {
                const response = await axiosInstance.post(`/api/order`, this.form);

                if (response.data.msg === 'success') {
                    ElMessage.success('订单添加成功');
                    this.resetForm();
                    this.getTableData();
                } else {
                    ElMessage.error('订单添加失败');
                }
            } catch (error) {
                console.error('请求出错:', error);
                ElMessage.error('订单添加失败');
            }
        },
        resetForm() {
            this.form = {
                customer: '',
                date: '',
                status: ''
            };
        },
        async getTableData() {
            try {
                const res = await axiosInstance.get(`/api/order`);
                if (res.data.msg === 'success') {
                    this.tableData = res.data.data;
                } else {
                    ElMessage.error('信息获取失败');
                }
            } catch (error) {
                console.error('获取数据出错:', error);
                ElMessage.error('信息获取失败');
            }
        },
        handleComplete(row) {
            ElMessageBox.confirm('确认完成订单吗?', '提醒', {
                confirmButtonText: '确认完成',
                cancelButtonText: '不完成',
                type: 'info',
            }).then(async () => {
                try {
                    const response = await axiosInstance.post(`/api/order/complete`, { id: row.id });
                    ElMessage.success(response.data.msg);
                    this.getTableData();
                } catch (error) {
                    ElMessage.error('完成订单失败');
                }
            }).catch(() => {
                ElMessage.info('未完成订单');
            });
        },
        handleDelete(row) {
            ElMessageBox.confirm('确认取消订单吗?', '警告', {
                confirmButtonText: '确认取消',
                cancelButtonText: '不取消',
                type: 'warning',
            }).then(async () => {
                try {
                    const response = await axiosInstance.post(`/api/order/cancel`, { id: row.id });
                    ElMessage.success(response.data.msg);
                    this.getTableData();
                } catch (error) {
                    ElMessage.error('取消订单失败');
                }
            }).catch(() => {
                ElMessage.info('未取消订单');
            });
        },
        statusType(status) {
            switch (status) {
                case 'pending':
                    return 'info'
                case 'cancelled':
                    return 'danger'
                case 'completed':
                    return 'success'
                default:
                    break;
            }

        }
    },
    created() {
        this.getTableData();
    }
}
</script>

<style lang="scss">
#orderManage {
    width: 100%;
    margin-top: 20px;

    .manageCover {
        width: 80%;
        margin: 0 auto;
        position: relative;

        .manageTitle {
            text-align: center;
            margin-bottom: 20px;
        }
    }
}
</style>
