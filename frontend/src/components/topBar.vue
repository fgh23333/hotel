<template>
    <div id="topBar">
        <el-row>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <slot name="left"></slot>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple-light">
                    {{ titie }}
                    <slot name="middle"></slot>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <slot name="right"></slot>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {

        }
    },
    computed: {
        titie() {
            switch (this.$route.path) {
                case '/userManage':
                    return '客户管理'
                case '/productManage':
                    return '进度管理'
                case '/orderManage':
                    return '订单管理'
                case '/truckManage':
                    return '车辆管理'
                case '/employeeManage':
                    return '员工管理'
                case '/goodsManage':
                    return '货物管理'
                case '/warehouseManage':
                    return '仓库管理'
                case '/recipientManage':
                    return '收件人管理'
                default:
                    return '主页'
            }
        }
    },
}
</script>

<style lang="scss">
#topBar {
    width: 100%;
    line-height: 60px;

    .el-row {
        margin-bottom: 20px;
    }

    .el-row:last-child {
        margin-bottom: 0;
    }

    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        height: 60px;
    }

    .bg-purple {
        background: #eee;
        font-weight: bold;
        font-size: 24px;
    }

    .bg-purple-light {
        background: #fff;
        font-weight: bold;
    }
}
</style>