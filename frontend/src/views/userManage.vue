<template>
    <div id="userManage">
        <div class="manageCover">
            <h2 class="manageTitle">用户管理</h2>
            <div class="manageForm">
                <addCustomer @updateData="refreshTable"></addCustomer>
            </div>
            <div class="manageTable">
                <el-table :data="tableData">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="phone" label="电话"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="address" label="地址"></el-table-column>
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
import addCustomer from '@/components/AddCustomer.vue'

export default {
    data() {
        return {
            tableData: [],
        }
    },
    components: {
        addCustomer
    },
    methods: {
        getTableData() {
            axiosInstance({
                method: 'GET',
                url: `http://${server}:${port}/api/user`
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
                    url: `http://${server}:${port}/api/user/${row.id}`,
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
        refreshTable(data) {
            if (data) {
                this.getTableData()
            } else {
                return
            }
        }
    },
    created() {
        this.getTableData()
    }
}
</script>

<style lang="scss">
#userManage {
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