<template>
    <div id="recipientManage">
        <div class="manageCover">
            <h2 class="manageTitle">收件人管理</h2>
            <div class="manageForm">
                <el-form :model="form" ref="formRef" label-width="120px">
                    <el-form-item label="收件人姓名" :rules="{ required: true, message: '请输入收件人姓名', trigger: 'blur' }">
                        <el-input v-model="form.RecipientName" />
                    </el-form-item>
                    <el-form-item label="电话" :rules="{ required: true, message: '请输入电话', trigger: 'blur' }">
                        <el-input v-model="form.PhoneNumber" />
                    </el-form-item>
                    <el-form-item label="地址" :rules="{ required: true, message: '请输入地址', trigger: 'blur' }">
                        <el-input v-model="form.Address" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">{{ isEdit ? '更新记录' : '添加记录' }}</el-button>
                        <el-button @click="resetForm">重置表单</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
                <el-table :data="recipients" style="width: 100%">
                    <el-table-column prop="RecipientID" label="收件人ID" width="100" />
                    <el-table-column prop="RecipientName" label="收件人姓名" />
                    <el-table-column prop="PhoneNumber" label="电话" />
                    <el-table-column prop="Address" label="地址" />
                    <el-table-column label="操作" width="180">
                        <template #default="{ row }">
                            <el-button @click="editRecipient(row.RecipientID)" size="small">编辑</el-button>
                            <el-button @click="deleteRecipient(row.RecipientID)" type="danger"
                                size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance'; // 导入封装好的 Axios 实例
import { ElMessage } from 'element-plus';

export default {
    name: 'RecipientManagement',
    data() {
        return {
            recipients: [], // 收件人列表
            form: {
                RecipientID: null,
                RecipientName: '',
                PhoneNumber: '',
                Address: '',
            },
            editingId: null, // 当前编辑的收件人ID
            isEdit: false
        };
    },
    methods: {
        // 获取所有收件人记录
        async fetchRecipients() {
            try {
                const response = await axiosInstance.get('/api/recipient');
                this.recipients = response.data;
            } catch (error) {
                ElMessage.error('获取收件人记录失败');
            }
        },
        // 添加收件人
        addRecipient() {
            this.resetForm();
            this.editingId = null;
        },
        // 编辑收件人
        async editRecipient(id) {
            try {
                this.isEdit = true
                const response = await axiosInstance.get(`/api/recipient/${id}`);
                this.form = { ...response.data };
                this.editingId = id;
            } catch (error) {
                ElMessage.error('获取收件人信息失败');
            }
        },
        // 提交表单（新增或编辑）
        async submit() {
            try {
                // 表单验证
                this.$refs.formRef.validate(async (valid) => {
                    if (valid) {
                        if (this.editingId) {
                            // 编辑
                            await axiosInstance.put(`/api/recipient/${this.editingId}`, this.form);
                            this.isEdit = false
                            ElMessage.success('收件人信息已更新');
                        } else {
                            // 新增
                            await axiosInstance.post('/api/recipient', this.form);
                            ElMessage.success('收件人记录已创建');
                        }
                        this.fetchRecipients(); // 刷新列表
                        this.resetForm(); // 重置表单
                    } else {
                        ElMessage.error('请完善表单信息');
                        return false;
                    }
                });
            } catch (error) {
                ElMessage.error('提交失败');
            }
        },
        // 标记删除收件人
        async deleteRecipient(id) {
            try {
                await axiosInstance.delete(`/api/recipient/${id}`);
                ElMessage.success('收件人记录已标记删除');
                this.fetchRecipients(); // 刷新列表
            } catch (error) {
                ElMessage.error('删除收件人记录失败');
            }
        },
        // 重置表单
        resetForm() {
            this.form = {
                RecipientID: null,
                RecipientName: '',
                PhoneNumber: '',
                Address: '',
            };
            this.editingId = null;
            this.$refs.formRef.resetFields();
        },
    },
    mounted() {
        this.fetchRecipients();
    },
};
</script>

<style lang="scss">
#recipientManage {
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