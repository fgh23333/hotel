<template>
    <div id="withdrawManage">
        <div class="manageCover">
            <h2 class="manageTitle">提现管理</h2>
            <div class="manageTable">
                <el-table :data="tableData">
                    <el-table-column fixed prop="user_id" label="用户id" width="100" />
                    <el-table-column prop="amount" label="总额" width="100" />
                    <el-table-column prop="created_at" label="发起时间" min-width="100" />
                    <el-table-column label="状态" width="100">
                        <template #default="scope">
                            {{ withdrawStatus[scope.row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="Operations" width="200">
                        <template #default="scope">
                            <el-button size="small" v-if="scope.row.status === 'pending'"
                                @click="handleEdit(scope.$index, scope.row)">
                                前往打款
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dialogForm">
                <el-dialog v-model="dialogFormVisible" header="提现详情" width="800" @close="recover">
                    <el-form :model="innerForm" class="form">
                        <el-form-item label="总额">
                            {{ innerForm.amount }}
                        </el-form-item>
                        <el-form-item label="发起时间">
                            {{ innerForm.created_at }}
                        </el-form-item>
                        <el-form-item label="用户id">
                            {{ innerForm.user_id }}
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="recover">取消</el-button>
                            <el-button type="primary" @click="commitNewVal">打款完成</el-button>
                        </div>
                    </template>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { port, server } from '@/utils/config';

export default {
    data() {
        return {
            tableData: [],
            dialogFormVisible: false,
            innerForm: {
                amount: null,
                url: null,
                user_id: null,
                created_at: null
            },
            withdrawStatus: {
                pending: '未打款',
                completed: '已打款'
            }
        }
    },
    methods: {
        getTableData() {
            axios({
                method: 'GET',
                url: `http://${server}:${port}/api/withdraw`
            }).then(res => {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].created_at = res.data.data[i].created_at.replace('T', ' ').replace('.000Z', '');
                }
                this.tableData = res.data.data
            })
        },
        recover() {
            this.dialogFormVisible = false
            this.innerForm = {
                amount: null,
                url: null,
                user_id: null,
                created_at: null
            }
        },
        commitNewVal() {
            const data = {
                requestId: this.innerForm.id
            }
            axios({
                method: 'POST',
                url: `http://${server}:${port}/api/withdraw/complete`,
                data: data
            }).then(res => {
                if (res.data.success) {
                    ElMessage({
                        message: '提交成功',
                        type: 'success'
                    })
                } else {
                    ElMessage({
                        message: '提交失败',
                        type: 'error'
                    })
                }
            })
        },
        handleEdit(index, row) {
            axios({
                method: 'GET',
                url: `http://${server}:${port}/api/user/payment/${row.user_id}`
            }).then(res => {
                row.url = res.data.url[0].payment_code
                console.log(row)
                this.innerForm = row
            })
            this.dialogFormVisible = true
        }
    }
}

</script>

<style lang='scss'>
#withdrawManage {
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