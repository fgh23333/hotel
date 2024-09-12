<template>
    <div id="navMenu">
        <h5 class="mb-2">title</h5>
        <el-menu default-active="2" class="el-menu-vertical-demo"
            :router="true">
            <el-menu-item index="/">
                <el-icon><House /></el-icon>
                <span>主页</span>
            </el-menu-item>
            <el-sub-menu index="2">
                <template #title>
                    <el-icon>
                        <location />
                    </el-icon>
                    <span>管理</span>
                </template>
                <el-menu-item index="userManage">用户管理</el-menu-item>
                <el-menu-item index="staffManage">员工管理</el-menu-item>
                <el-menu-item index="orderManage">回收订单管理</el-menu-item>
                <el-menu-item index="withdrawManage">提现管理</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
</script>

<style lang="scss"></style>