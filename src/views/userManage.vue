<template>
    <div id="userManage">
        <div class="manageCover">
            <h2 class="manageTitle">用户管理</h2>
            <!-- <div class="manageForm">
                <el-form>
                    <el-form-item label="用户名">
                        <el-input v-model="form.title" placeholder="请输入回收物名称（必填）" clearable />
                    </el-form-item>
                    <el-form-item label="用户id">
                        <el-input-number v-model="form.price" :min="0" :step="0.01" :precision="2" />
                    </el-form-item>
                    <el-form-item label="类别">
                        <el-select v-model="form.type" placeholder="请选择回收物类别（必填）" clearable>
                            <el-option :label="item.type" :value="item.id" v-for="(item, i) in types" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleAdd">添加</el-button>
                    </el-form-item>
                </el-form>
            </div> -->
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
import { server, port } from '@/utils/config.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/store/index';
import axiosInstance from '@/utils/axiosInstance';

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
            axiosInstance({
                method: 'GET',
                url: `http://${server}:${port}/api/user`
            }).then(async res => {
                if (res.data.msg == 'success') {
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = res.data.data[i].create_time.replace('T', ' ').replace('.000Z', '');
                    }
                    this.tableData = res.data.data
                } else {
                    ElMessage({
                        message: '信息获取失败',
                        type: 'error'
                    })
                }
            })
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
                axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/user/upgrade`,
                    data: form
                }).then(res => {
                    if (res.data.msg == 'success') {
                        this.recover()
                        ElMessage({
                            message: `升级成功`,
                            type: 'success'
                        })
                        this.getTableData()
                    } else {
                        ElMessage({
                            message: `升级失败`,
                            type: 'error'
                        })
                    }
                })
            }
        },
        async handleDelete(index, row) {
            const authStore = useAuthStore(); // 使用 Pinia store

            try {
                const response = await axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/user/${row.id}`,
                });

                if (response.data.msg === 'success') {
                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    });
                    // 可能需要刷新表格数据的方法
                    this.getTableData(); // 这里的 `this` 取决于你的上下文
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
        handleFileChange(event) {
            this.formData.file = event.target.files[0]
            if (this.formData.file) {
                this.generateUniqueFilename(this.formData.file.name)
            }
        },
        async generateUniqueFilename(originalName) {
            const timestamp = Date.now()
            const extension = originalName.split('.').pop()
            const uniqueFilename = `avatar-${timestamp}.${extension}`
            this.formData.filename = uniqueFilename
            this.uploadFile()
        },
        async uploadFile() {
            const response = await axios.post('https://swiper-worker.jimmy120070.workers.dev/', this.formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            })

            if (response.status === 200) {
                this.innerForm.url = `https://swiper.alni.eu.org/${this.formData.filename}`
                ElMessage({
                    message: `图片上传成功`,
                    type: 'success'
                })
                this.formData = {
                    filename: '',
                    file: null
                }
            } else {
                ElMessage({
                    message: `Error: ${response.statusText}`,
                    type: 'error'
                })
            }
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