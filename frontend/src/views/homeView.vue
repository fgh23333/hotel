<template>
    <div id="homeView">
        <div class="common-layout">
            <el-container>
                <el-header>
                    <topBar>
                        <template v-slot:left>
                            物流管理系统
                        </template>
                        <template v-slot:right>
                            <el-button type="danger" @click="logout">退出登录</el-button>
                        </template>
                    </topBar>
                </el-header>
                <el-container>
                    <el-aside width="200px">
                        <navMenu>

                        </navMenu>
                    </el-aside>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </div>
    </div>
</template>

<style lang="scss">
#homeView {
    .common-layout {

        .el-header,
        .el-footer {
            display: flex;
            align-items: center;
        }

        .el-header,
        .el-footer {
            background-color: var(--el-color-primary-light-7);
            color: var(--el-text-color-primary);
            text-align: center;
            height: 60px;
            padding: 0;
        }

        .el-main {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-text-color-primary);
            text-align: center;
            height: calc(100vh - 60px);
            padding: 0;
        }

        .el-aside {
            background-color: var(--el-color-primary-light-8);
            color: var(--el-text-color-primary);
            text-align: center;
            height: calc(100vh - 60px);
        }
    }
}
</style>

<script>
import topBar from '@/components/topBar.vue'
import navMenu from "@/components/navMenu.vue";
import { useAuthStore } from "@/store/index.js";

export default {
    components: {
        topBar,
        navMenu
    },
    methods: {
        logout() {
            useAuthStore().logout(this.$router)
        }
    }
}
</script>