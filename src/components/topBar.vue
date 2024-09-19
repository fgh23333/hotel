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
    }
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
        background: #99a9bf;
    }

    .bg-purple-light {
        background: #FAFBFF;
    }
}
</style>