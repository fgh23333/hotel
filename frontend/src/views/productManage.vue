<template>
    <div id="productManage">
        <div class="manageCover">
            <h2 class="manageTitle">进度管理</h2>
            <div class="manageForm">
                <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" label-position="left"
                    @submit.native.prevent>
                    <el-form-item label="司机" prop="driver">
                        <el-input v-model="form.driver" placeholder="请输入司机姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="订单ID" prop="orderId">
                        <el-input v-model="form.orderId" placeholder="请输入订单ID"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆ID" prop="vehicle">
                        <el-input v-model="form.vehicle" placeholder="请输入车辆ID"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="form.status" placeholder="选择状态">
                            <el-option label="运输中" value="pending"></el-option>
                            <el-option label="已完成" value="completed"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd" :loading="loading.add">添加</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
                <el-table :data="tableData" style="width: 100%" v-loading="loading.table" element-loading-text="加载中...">
                    <el-table-column prop="id" label="配送ID"></el-table-column>
                    <el-table-column prop="order_id" label="订单ID"></el-table-column>
                    <el-table-column prop="vehicle" label="运输车辆"></el-table-column>
                    <el-table-column prop="driver" label="司机"></el-table-column>
                    <el-table-column label="进度">
                        <template #default="scope">
                            <el-progress :percentage="getDeliveryProgress(scope.row.status)"
                                :status="scope.row.status === 'completed' ? 'success' : 'active'"></el-progress>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="success" size="small" @click="handleEdit(scope.row)"
                                v-if="scope.row.status !== 'completed'">确认到达</el-button>
                            <el-button type="danger" size="small" @click="confirmDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import axiosInstance from '@/utils/axiosInstance';

export default {
    data() {
        return {
            tableData: [],
            form: {
                status: '',
                driver: '',
                orderId: '',
                vehicle: ''
            },
            loading: {
                table: false,
                add: false,
                delete: false
            },
            rules: {
                driver: [
                    { required: true, message: '请输入司机姓名', trigger: 'blur' }
                ],
                orderId: [
                    { required: true, message: '请输入订单ID', trigger: 'blur' },
                ],
                vehicle: [
                    { required: true, message: '请输入车辆ID', trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            }
        };
    },
    methods: {
        // 获取配送进度数据
        async getTableData() {
            this.loading.table = true;
            try {
                const response = await axiosInstance.get(`/api/delivery_progress`);
                if (response.data.message === '获取配送进度失败') {
                    throw new Error(response.data.message);
                }
                this.tableData = response.data.data;
            } catch (error) {
                ElMessage.error('信息获取失败: ' + (error.response?.data?.message || error.message));
            } finally {
                this.loading.table = false;
            }
        },
        // 添加配送进度
        handleAdd() {
            this.$refs.formRef.validate(async (valid) => {
                if (valid) {
                    this.loading.add = true;
                    const postData = {
                        driver: this.form.driver,
                        status: this.form.status,
                        vehicle: this.form.vehicle,
                        orderId: this.form.orderId
                    };
                    try {
                        const response = await axiosInstance.post(`/api/delivery_progress`, postData);
                        if (response.data.msg === 'success') {
                            this.getTableData();
                            ElMessage.success('成功添加配送进度');
                            this.handleReset();
                        } else {
                            ElMessage.error('添加配送进度失败: ' + response.data.message);
                        }
                    } catch (error) {
                        ElMessage.error('添加配送进度失败: ' + (error.response?.data?.message || error.message));
                    } finally {
                        this.loading.add = false;
                    }
                } else {
                    ElMessage.warning('请完善表单信息');
                }
            });
        },
        // 确认删除配送进度
        confirmDelete(row) {
            ElMessageBox.confirm(
                `确定要删除配送ID为 ${row.id} 的记录吗？`,
                '确认删除',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                this.handleDelete(row);
            }).catch(() => {
                // 取消删除
            });
        },
        // 删除配送进度
        async handleDelete(row) {
            this.loading.delete = true;
            try {
                const response = await axiosInstance.delete(`/api/delivery_progress/${row.id}`);
                if (response.status === 200) {
                    ElMessage.success('删除成功');
                    this.getTableData();
                } else {
                    ElMessage.error('删除失败');
                }
            } catch (error) {
                ElMessage.error('删除失败');
            } finally {
                this.loading.delete = false;
            }
        },
        // 编辑（确认到达）
        async handleEdit(row) {
            try {
                const updatedData = { id: row.id };
                const response = await axiosInstance.post(`/api/delivery_progress/confirm`, updatedData);
                if (response.data.msg === 'success') {
                    this.getTableData();
                    ElMessage.success('确认到达成功');
                } else {
                    ElMessage.error('确认到达失败');
                }
            } catch (error) {
                ElMessage.error('确认到达失败');
            }
        },
        // 根据状态计算进度条百分比
        getDeliveryProgress(status) {
            return status === 'completed' ? 100 : 50;
        },
        // 重置表单
        handleReset() {
            this.form = {
                status: '',
                driver: '',
                orderId: '',
                vehicle: ''
            };
            this.$refs.formRef.resetFields();
        }
    },
    created() {
        this.getTableData();
    }
};
</script>

<style lang="scss">
#productManage {
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

        .manageForm {
            width: 100%;
            margin-bottom: 30px;

            .el-form-item {
                margin-bottom: 20px;
            }
        }

        .manageTable {
            width: 100%;
        }
    }
}
</style>