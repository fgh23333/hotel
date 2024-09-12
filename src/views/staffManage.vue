<template>
    <div id="staffManage">
        <div class="manageCover">
            <h2>员工管理</h2>
            <div class="manageTable">
                <el-table :data="tableData">
                    <el-table-column fixed prop="id" label="员工id" width="100" />
                    <el-table-column prop="nick_name" label="昵称" width="100" />
                    <el-table-column prop="name" label="姓名" width="100" />
                    <el-table-column prop="phone" label="电话" width="100" />
                    <el-table-column label="性别" width="100">
                        <template #default="scope">
                            {{ gender[scope.row.gender] }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="添加时间" min-width="100" />
                    <el-table-column fixed="right" label="Operations" width="200">
                        <template #default="scope">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
    data() {
        return {
            tableData: [],
            gender: {
                0: '未知',
                1: '男性',
                2: '女性'
            }
        }
    },
    methods: {
        handleDelete(index, row) {
            
        }
    }
}
</script>

<style lang="scss">
#staffManage {
    width: 100%;

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