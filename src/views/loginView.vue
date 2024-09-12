<template>
    <div id="loginView">
        <div class="formWrapper">
            <div class="formTitle"><b>登 录</b></div>
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
import { useAuthStore } from '@/store/index'; // 引入 Pinia store
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        };
    },
    methods: {
        async login() {
            if (this.user.username == 'admin' && this.user.password == 'admin123') {
                localStorage.setItem('login', 'true')
                this.$router.push('/')
                ElMessage({
                    message: '登录成功',
                    type: 'success'
                })
            } else {
                localStorage.setItem('login', 'false')
                ElMessage({
                    message: '登录失败',
                    type: 'success'
                })
            }
        }
    },
    created() {
        const token = localStorage.getItem('token');
    }
};
</script>

<style lang="scss">
#loginView {
    height: 100vh;
    background-image: linear-gradient(to bottom right, rgb(180, 245, 106), #ffffff);
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