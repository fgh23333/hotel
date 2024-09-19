<template>
    <div id="addCustomer">
        <el-form :model="newCustomer" ref="customerForm" label-width="80px">
            <el-form-item label="姓名" required>
                <el-input v-model="newCustomer.name" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
            <el-form-item label="电话" required>
                <el-input v-model="newCustomer.phone" placeholder="请输入客户电话"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="newCustomer.email" placeholder="请输入客户邮箱"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="newCustomer.address" placeholder="请输入客户地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitCustomer">添加</el-button>
                <el-button @click="cancel">清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance';

export default {
    data() {
        return {
            newCustomer: {
                name: '',
                phone: '',
                email: '',
                address: '',
            }
        };
    },
    methods: {
        async submitCustomer() {
            if (!this.newCustomer.name || !this.newCustomer.phone) {
                this.$message.error('姓名和电话为必填项！');
                return;
            }

            try {
                const response = await axiosInstance({
                    method: 'POST',
                    url: `http://${server}:${port}/api/user`,
                    data: this.newCustomer
                });

                if (response.data.msg === 'success') {
                    this.$message.success('客户添加成功');
                    this.newCustomer = {
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                    };
                    this.$emit('updateData', true)
                } else {
                    this.$message.error('客户添加失败');
                }
            } catch (error) {
                console.error('请求出错:', error);
                this.$message.error('客户添加失败');
            }
        },
        cancel() {
            this.newCustomer = {
                name: '',
                phone: '',
                email: '',
                address: '',
            }
        }
    }
};
</script>

<style lang="scss">
#addCustomer {
    margin-top: 20px;
}
</style>