<template>
    <div id="loginView">
        <div class="formWrapper">
            <div class="formTitle"><b>欢迎</b></div>
            <el-form :model="user" :rules="rules" ref="userForm">
                <el-form-item prop="username">
                    <el-input class="usernameBox inputBox" v-model="user.username">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="pwdBox inputBox" show-password v-model="user.password">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="submitButton" type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/store/index';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { server, port } from "@/utils/config";

export default {
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        async login() {
            this.$refs['userForm'].validate(async (valid) => {
                if (valid) {
                    const authStore = useAuthStore();
                    try {
                        await authStore.login(this.user, this.$router);
                    } catch (error) {
                        ElMessage({
                            message: '登录失败，请检查账号或密码',
                            type: 'error'
                        });
                    }
                }
            });
        }
    },
    created() {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://${server}:${port}/auth/verify-token`, { token })
                .then(response => {
                    if (response.data.valid) {
                        useAuthStore().token = token
                        useAuthStore().headers['blade-auth'] = token
                    } else {
                        localStorage.removeItem('token');
                        console.log('Token expired, please login again');
                    }
                })
                .catch(error => {
                    console.error('Error verifying token:', error);
                    localStorage.removeItem('token');
                });
        }
    }
};
</script>

<style lang="scss">
#loginView {
    height: 100vh;
    background-image: url(https://images.agriharvest.tw/wp-content/uploads/2023/02/5-5-1024x683.jpg);
    background-size:cover;
    overflow: hidden;

    .formWrapper {
        margin: 250px auto;
        background-color: #fff;
        width: 300px;
        height: 250px;
        padding: 20px;
        border-radius: 10px;

        .formTitle {
            margin: 20px 0;
            text-align: center;
            font-size: 24px;

            .inputBox {
                margin: 10px 0;
            }
        }

        .submitButton {
            display: block;
            margin: 10px auto;
        }
    }
}
</style>