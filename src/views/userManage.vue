<template>
    <div id="userManage">
        <div class="manageCover">
            <h2 class="manageTitle">用户管理</h2>
            <div class="manageTable">
                <el-table :data="tableData">
                    <el-table-column fixed prop="id" label="用户id" width="100" />
                    <el-table-column prop="nick_name" label="昵称" width="100" />
                    <el-table-column label="性别" width="100">
                        <template #default="scope">
                            {{ gender[scope.row.gender] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="注册时间" min-width="100" />
                    <el-table-column label="权限" width="100">
                        <template #default="scope">
                            {{ type[scope.row.type] }}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="Operations" width="200">
                        <template #default="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                                v-if="scope.row.type == 1">
                                权限升级
                            </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                删除用户
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="dialogForm">
                    <el-dialog v-model="dialogFormVisible" header="用户详情" width="800" @close="recover">
                        <el-form :model="innerForm" class="form">
                            <el-form-item label="用户id">
                                {{ innerForm.id }}
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="innerForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="电话">
                                <el-input v-model="innerForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="头像">
                                <input type="file" @change="handleFileChange" class="fileInput" />
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
    </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/index';

export default {
    data() {
        return {
            tableData: [],
            gender: {
                0: '未知',
                1: '男性',
                2: '女性'
            },
            type: {
                1: '普通用户',
                2: '员工',
                3: '合伙人'
            },
            dialogFormVisible: false,
            innerForm: {
                name: '',
                phone: '',
                url: ''
            },
            formData: {
                filename: '',
                file: null
            }
        }
    },
    methods: {
        getTableData() {
        
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true
            this.innerForm = this.tableData[index]
            this.innerForm.name = ''
            this.innerForm.phone = ''
        },
        recover() {
            this.dialogFormVisible = false
            this.innerForm = {
                name: '',
                phone: '',
                url: ''
            }
        },
        commitNewVal() {
            if (this.innerForm.phone == '' || this.innerForm.name == '' || this.innerForm.url == '') {
                ElMessage({
                    message: `请完整填写表单`,
                    type: 'info'
                })
                return
            } else {
                const form = {
                    id: this.innerForm.id,
                    phone: this.innerForm.phone,
                    name: this.innerForm.name,
                    gender: this.innerForm.gender,
                    openid: this.innerForm.openid,
                    token: '',
                    url: this.innerForm.url
                }
            
            }
        },
        async handleDelete(index, row) {
            const authStore = useAuthStore(); // 使用 Pinia store
        },
        handleFileChange(event) {
        },
        
        async uploadFile() {

        },
    },
    created() {
        this.getTableData()
    }
}
</script>

<style lang="scss">
#userManage {
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