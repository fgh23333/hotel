<template>
    <div id="truckManage">
        <div class="manage-cover">
            <div class="manage-form">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="司机ID">
                        <el-input v-model="form.driverId"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">添加</el-button>
                        <el-button @click="resetForm">重置表单</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manage-table">
                <el-table :data="tableData">
                    <el-table-column prop="id" label="ID" width="50"></el-table-column>
                    <el-table-column prop="DriverID" label="司机ID"></el-table-column>
                    <el-table-column prop="TruckName" label="车辆名称"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button @click="handleDelete(scope.$index, scope.row)" type="danger"
                                size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { server, port } from '@/utils/config.js';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/store/index';
import axiosInstance from '@/utils/axiosInstance';

export default {
    data() {
        return {
            // 表格数据
            tableData: [],
            // 表单数据
            form: {
                driverId: '',
                name: '',
            }
        };
    },
    methods: {
        /**
         * 获取车辆数据
         */
        async getTableData() {
            try {
                const response = await axiosInstance({
                    method: 'GET',
                    url: `http://${server}:${port}/api/truck`,
                });

                if (response.data.msg === 'success') {
                    this.tableData = response.data.data;
                } else {
                    this.showErrorMessage('信息获取失败');
                }
            } catch (error) {
                console.error('请求出错:', error);
                this.showErrorMessage('信息获取失败');
            }
        },

        /**
         * 处理删除车辆
         * @param {Number} index 
         * @param {Object} row 
         */
        async handleDelete(index, row) {
            const authStore = useAuthStore();

            try {
                const response = await axiosInstance({
                    method: 'DELETE',
                    url: `http://${server}:${port}/api/truck/${row.id}`,
                });

                if (response.data.msg === 'success') {
                    this.showSuccessMessage('删除成功');
                    this.getTableData(); // 刷新表格数据
                } else {
                    this.showErrorMessage('删除失败');
                }
            } catch (error) {
                console.error('请求出错:', error);

                // 如果出现 401 错误，触发登出逻辑
                if (error.response && error.response.status === 401) {
                    authStore.logout(this.$router);
                } else {
                    this.showErrorMessage('删除失败');
                }
            }
        },

        /**
         * 处理添加车辆
         */
        async handleAdd() {
            if (!this.form.driverId || !this.form.name) {
                this.showWarningMessage('请填写司机和车辆');
                return;
            }

            const postData = {
                driverId: this.form.driverId,
                name: this.form.name,
            };

            try {
                const response = await axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/truck`,
                    data: postData,
                });

                if (response.data.msg === 'success') {
                    this.showSuccessMessage('成功添加');
                    this.resetForm();
                    this.getTableData();
                } else {
                    this.showErrorMessage('添加失败');
                }
            } catch (error) {
                console.error('请求出错:', error);
                this.showErrorMessage('添加失败');
            }
        },

        /**
         * 重置表单
         */
        resetForm() {
            this.form.driverId = '';
            this.form.name = '';
        },

        /**
         * 显示成功消息
         * @param {String} message 
         */
        showSuccessMessage(message) {
            ElMessage({
                message,
                type: 'success',
            });
        },

        /**
         * 显示错误消息
         * @param {String} message 
         */
        showErrorMessage(message) {
            ElMessage({
                message,
                type: 'error',
            });
        },

        /**
         * 显示警告消息
         * @param {String} message 
         */
        showWarningMessage(message) {
            ElMessage({
                message,
                type: 'warning',
            });
        },
    },

    // 生命周期钩子：组件创建时获取表格数据
    created() {
        this.getTableData();
    },
};
</script>

<style scoped lang="scss">
#truckManage {
    width: 100%;
    margin-top: 20px;

    .manage-cover {
        width: 80%;
        margin: 0 auto;
        position: relative;

        .manage-form {
            margin-bottom: 20px;
        }

        .manage-table {
            margin-top: 20px;
        }
    }
}
</style>
