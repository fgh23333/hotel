<template>
    <div id="homeView">
        <div class="common-layout">
            <el-container>
                <el-header>
                    <topBar>
                        <template v-slot:middle>
                            <div>hello</div>
                        </template>
                    </topBar>
                </el-header>
                <el-container>
                    <el-aside width="200px">
                        <navMenu></navMenu>
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

export default {
    components: {
        topBar,
        navMenu
    }
}
</script>