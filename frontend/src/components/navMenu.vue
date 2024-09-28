<template>
    <div id="navMenu">
        <el-menu default-active="2" class="el-menu-vertical-demo" :router="true">
            <el-sub-menu index="/">
                <template #title>
                    <el-icon>
                        <location />
                    </el-icon>
                    <span>管理</span>
                </template>
                <el-menu-item index="userManage">客户管理</el-menu-item>
                <el-menu-item index="productManage">进度管理</el-menu-item>
                <el-menu-item index="orderManage">订单管理</el-menu-item>
                <el-menu-item index="truckManage">车辆管理</el-menu-item>
                <el-menu-item index="employeeManage">员工管理</el-menu-item>
                <el-menu-item index="goodsManage">货物管理</el-menu-item>
                <el-menu-item index="warehouseManage">仓库管理</el-menu-item>
                <el-menu-item index="recipientManage">收件人管理</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script>
import {
    Menu as IconMenu,
    Location,
} from '@element-plus/icons-vue'
</script>

<style lang="scss"></style>