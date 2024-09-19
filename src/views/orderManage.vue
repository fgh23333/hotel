<template>
    <div id="orderManage">
        <div class="manageCover">
            <h2 class="manageTitle">订单管理</h2>
            <el-form :model="form" label-width="100px" class="order-form">
                <el-form-item label="客户">
                    <el-input v-model="form.customer" placeholder="请输入客户姓名"></el-input>
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
                <el-table :data="tableData">
                    <el-table-column prop="id" label="订单ID" width="100"></el-table-column>
                    <el-table-column prop="customer" label="客户"></el-table-column>
                    <el-table-column prop="date" label="日期"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <!-- <template #default="scope">
                            <el-tag :type="statusType(scope.row.status)">{{ scope.row.status }}</el-tag>
                        </template> -->
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { server, port } from '@/utils/config.js'
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
            }
        }
    },
    methods: {
        async handleAdd() {
            if (!this.form.customer || !this.form.date || !this.form.status) {
                ElMessage({
                    message: '客户、日期和状态为必填项',
                    type: 'warning'
                });
                return;
            }

            const postData = {
                customer: this.form.customer,
                date: this.form.date,
                status: this.form.status
            };

            try {
                const response = await axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/order`,
                    data: postData
                });

                if (response.data.msg === 'success') {
                    ElMessage({
                        message: '订单添加成功',
                        type: 'success'
                    });

                    // 清空表单
                    this.form = {
                        customer: '',
                        date: '',
                        status: ''
                    };

                    this.getTableData();
                } else {
                    ElMessage({
                        message: '订单添加失败',
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('请求出错:', error);
                ElMessage({
                    message: '订单添加失败',
                    type: 'error'
                });
            }
        },
        getTableData() {
            axiosInstance({
                method: 'GET',
                url: `http://${server}:${port}/api/order`
            }).then(async res => {
                if (res.data.msg == 'success') {
                    this.tableData = res.data.data
                    console.log(this.tableData);
                    
                } else {
                    ElMessage({
                        message: '信息获取失败',
                        type: 'error'
                    })
                }
            })
        },
        handleDelete(index, row) {
            ElMessageBox.confirm(
                '确认取消订单吗?',
                'Warning',
                {
                    confirmButtonText: '确认取消',
                    cancelButtonText: '不取消',
                    type: 'warning',
                }
            ).then(() => {
                const postData = {
                    id: row.id
                }
                axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/order/cancel`,
                    data: postData
                }).then(res => {
                    ElMessage({
                        message: res.data.msg,
                        type: 'success'
                    })
                    if (res.status == 200) {
                        this.getTableData()
                        ElMessage({
                            message: res.data.msg,
                            type: 'success'
                        })
                    } else {
                        ElMessage({
                            message: res.data.msg,
                            type: 'error'
                        })
                    }

                })
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '未取消订单'
                })
            })
        }
    },
    created() {
        this.getTableData()
    }
}
</script>

<style lang="scss">
#orderManage {
    width: 100%;

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