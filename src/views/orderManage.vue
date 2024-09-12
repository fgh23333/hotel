<template>
    <div id="orderManage">
        <div class="manageCover">
            <h2 class="manageTitle">回收订单管理</h2>
            <div class="manageTable">
                <el-table :data="tableData">
                    <el-table-column prop="order_id" label="单号" min-width="100" />
                    <el-table-column prop="award" label="总价" width="100">
                        <template #default="scope">
                            {{ scope.row.award ? scope.row.award : '待结算' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template #default="scope">
                            {{ orderStatus[scope.row.status] }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="300">
                        <template #default="scope">
                            <el-button size="small" @click="handleInfo(scope.$index, scope.row)">
                                订单详情
                            </el-button>
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.status === 3" type="primary">
                                去结算
                            </el-button>
                            <el-button size="small" v-if="status.includes(scope.row.status)" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">
                                取消订单
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dialogForm">
                <el-dialog v-model="dialogFormVisible" header="回收物详情" width="800" @close="recover">
                    <el-form :model="innerForm" class="form">
                        <el-form-item label="单号">
                            {{ innerForm.order_id }}
                        </el-form-item>
                        <el-form-item label="总价">
                            {{ innerForm.award ? innerForm.award : '待结算' }}
                        </el-form-item>
                        <el-form-item label="下单时间">
                            {{ innerForm.order_time }}
                        </el-form-item>
                        <el-form-item label="预约时间">
                            {{ innerForm.appointment_time }}
                        </el-form-item>
                        <el-form-item label="用户id">
                            {{ innerForm.user_id }}
                        </el-form-item>
                        <el-form-item label="接单员id">
                            {{ innerForm.staff_id }}
                        </el-form-item>
                        <el-form-item label="订单状态">
                            {{ orderStatus[innerForm.status] }}
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="recover">取消</el-button>
                            <el-button type="primary" @click="commitNewVal">确认</el-button>
                        </div>
                    </template>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/index';

export default {
    data() {
        return {
            tableData: [],
            innerForm: {
                order_id: '',
                award: 0,
                order_type: '',
                status: '',
                order_time: '',
                appointment_time: '',
                user_id: '',
                staff_id: '',
                points: '',
                tips: ''
            },
            dialogFormVisible: false,
            orderStatus: {
                0: '待接单',
                1: '待取货',
                2: '待入库',
                3: '待结算',
                4: '已完成',
                404: '已取消'
            },
            status: [0, 1, 2, 3]
        }
    },
    methods: {
        getTableData() {
            
        },
        handleInfo(index, row) {
            this.dialogFormVisible = true
            this.innerForm = this.tableData[index]
        },
        recover() {
            this.dialogFormVisible = false
            this.innerForm = {
                order_id: '',
                award: 0,
                order_type: '',
                status: '',
                order_time: '',
                appointment_time: '',
                user_id: '',
                staff_id: '',
                points: '',
                tips: '',
                secret: ''
            }
        },
        commitNewVal() {

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
                    order_id: row.order_id,
                    user_id: row.user_id,
                    secret: row.secret
                }
                
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '未取消订单'
                })
            })
        },
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