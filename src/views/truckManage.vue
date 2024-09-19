<template>
    <div id="truckManage">
        <div class="manageCover">
            <h2 class="manageTitle">车辆管理</h2>
            <div class="manageForm">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="司机ID">
                        <el-input v-model="form.driverId"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
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
import { server, port } from '@/utils/config.js'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/index';
import axiosInstance from '@/utils/axiosInstance';

export default {
    data() {
        return {
            tableData: [],
            form: {
                driverId: '',
                name: ''
            }
        }
    },
    methods: {
        getTableData() {
            axiosInstance({
                method: 'GET',
                url: `http://${server}:${port}/api/truck`
            }).then(async res => {
                if (res.data.msg == 'success') {
                    this.tableData = res.data.data
                } else {
                    ElMessage({
                        message: '信息获取失败',
                        type: 'error'
                    })
                }
            })
        },
        async handleDelete(index, row) {
            const authStore = useAuthStore();

            try {
                const response = await axiosInstance({
                    method: 'DELETE',
                    url: `http://${server}:${port}/api/truck/${row.id}`,
                });

                if (response.data.msg === 'success') {
                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    });

                    this.getTableData();
                } else {
                    ElMessage({
                        message: '删除失败',
                        type: 'error',
                    });
                }
            } catch (error) {
                console.error('请求出错:', error);
                // 处理请求错误，例如 401 错误
                if (error.response && error.response.status === 401) {
                    authStore.logout(this.$router); // 触发登出逻辑
                }
            }
        },
        async handleAdd() {
            if (!this.form.driverId || !this.form.name) {
                ElMessage({
                    message: '请填写司机和车辆',
                    type: 'warning'
                });
                return;
            }

            const postData = {
                driverId: this.form.driverId,
                name: this.form.name
            };

            try {
                const response = await axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/truck`,
                    data: postData
                });

                if (response.data.msg === 'success') {
                    this.getTableData();

                    ElMessage({
                        message: '成功添加',
                        type: 'success'
                    });

                    this.form.driverId = '';
                    this.form.name = '';

                } else {
                    ElMessage({
                        message: '添加失败',
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('请求出错:', error);
                ElMessage({
                    message: '添加失败',
                    type: 'error'
                });
            }
        }
    },
    created() {
        this.getTableData()
    }
}
</script>

<style lang="scss">
#truckManage {
    width: 100%;
    margin-top: 20px;

    .manageCover {
        width: 80%;
        margin: 0 auto;
        position: relative;

        .manageTitle {
            text-align: center;
        }
    }
}
</style>