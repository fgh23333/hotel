<template>
    <div id="productManage">
        <div class="manageCover">
            <h2 class="manageTitle">进度管理</h2>
            <div class="manageForm">
                <el-form :model="form" label-width="auto">
                    <el-form-item label="司机">
                        <el-input v-model="form.driver"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="form.status" placeholder="选择状态">
                            <el-option label="运输中" value="pending"></el-option>
                            <el-option label="已完成" value="completed"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="id" label="配送ID" width="100"></el-table-column>
                    <el-table-column prop="orderId" label="订单ID"></el-table-column>
                    <el-table-column prop="vehicle" label="运输车辆"></el-table-column>
                    <el-table-column prop="driver" label="司机"></el-table-column>
                    <el-table-column label="进度">
                        <template #default="scope">
                            <el-progress :percentage="getDeliveryProgress(scope.row.status)" :text-inside="true" />
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
import axiosInstance from '@/utils/axiosInstance'

export default {
    data() {
        return {
            tableData: [],
            form: {
                status: '',
                driver: ''
            }
        }
    },
    methods: {
        async handleAdd() {
            if (!this.form.driver || !this.form.status) {
                ElMessage({
                    message: '请填写司机和状态',
                    type: 'warning'
                });
                return;
            }

            const postData = {
                driver: this.form.driver,
                status: this.form.status
            };

            try {
                const response = await axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/product`, // 替换为你的接口路径
                    data: postData
                });

                if (response.data.msg === 'success') {
                    ElMessage({
                        message: '成功添加配送进度',
                        type: 'success'
                    });

                    this.form.driver = '';
                    this.form.status = '';

                    // 刷新表格数据
                    this.getTableData();
                } else {
                    ElMessage({
                        message: '添加配送进度失败',
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('请求出错:', error);
                ElMessage({
                    message: '添加配送进度失败',
                    type: 'error'
                });
            }
        },
        // 根据状态计算进度条百分比
        getDeliveryProgress(status) {
            return status === '已完成' ? 100 : 50;
        },
        handleDelete(index, row) {
            let removed = this.tableData[index]
            axiosInstance({
                method: 'Delete',
                url: `http://${server}:${port}/api/product/${removed.id}`
            }).then(res => {
                if (res.data.msg == 'success') {
                    this.tableData.splice(index, 1)
                    ElMessage({
                        message: '删除成功',
                        type: 'success'
                    })
                } else {
                    ElMessage({
                        message: '删除失败',
                        type: 'error'
                    })
                }
            })
        },
        getTableData() {
            axiosInstance({
                method: 'GET',
                url: `http://${server}:${port}/api/product`
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
    },
    created() {
        this.getTableData()
    }
}
</script>

<style lang="scss">
#productManage {
    width: 100%;

    .manageCover {
        width: 80%;
        margin: 0 auto;
        position: relative;

        .manageTitle {
            text-align: center;
        }

        .manageForm {
            width: 100%;

            .demo-form-inline .el-input {
                --el-input-width: 220px;
            }

            .demo-form-inline .el-select {
                --el-select-width: 220px;
            }
        }
    }
}
</style>