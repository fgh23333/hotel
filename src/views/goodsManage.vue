<template>
    <div id="goodsManage">
        <div class="manageCover">
            <h2 class="manageTitle">货物管理</h2>
            <div class="manageForm">
                <el-form :model="form" ref="formRef" label-width="120px">
                    <el-form-item label="货物名称">
                        <el-input v-model="form.GoodsName" />
                    </el-form-item>
                    <el-form-item label="客户ID">
                        <el-input v-model="form.CustomerID" />
                    </el-form-item>
                    <el-form-item label="入库日期">
                        <el-date-picker v-model="form.EntryDate" type="date" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">{{ isEdit ? '更新货物' : '添加货物' }}</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
                <el-table :data="goods" style="width: 100%">
                    <el-table-column prop="GoodsID" label="货物ID" />
                    <el-table-column prop="GoodsName" label="货物名称" />
                    <el-table-column prop="EntryDate" label="入库日期" />
                    <el-table-column prop="CustomerID" label="客户ID" />
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button size="small" @click="editGoods(scope.row.GoodsID)">编辑</el-button>
                            <el-button size="small" @click="deleteGoods(scope.row.GoodsID)" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </div>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance'; // 导入封装好的 Axios 实例
import { ElMessage } from 'element-plus';

export default {
    name: 'GoodsManagement',
    data() {
        return {
            goods: [],
            form: {
                GoodsName: '',
                CustomerID: '',
                EntryDate: '',
            },
            editingId: null, // 用于记录正在编辑的货物ID
            isEdit: false, // 是否为编辑模式
        };
    },
    methods: {
        async fetchGoods() {
            try {
                let response = await axiosInstance.get('/api/goodsList');
                for (let i = 0; i < response.data.length; i++) {
                    response.data[i].EntryDate = new Date(response.data[i].EntryDate).toISOString().slice(0, 10);
                }
                this.goods = response.data;
            } catch (error) {
                ElMessage.error('获取货物失败');
            }
        },
        async deleteGoods(id) {
            try {
                await axiosInstance.delete(`/api/goodsList/${id}`);
                ElMessage.success('货物已标记删除');
                this.fetchGoods(); // 刷新列表
            } catch (error) {
                ElMessage.error('删除货物失败');
            }
        },
        async editGoods(id) {
            this.isEdit = true;
            try {
                const response = await axiosInstance.get(`/api/goodsList/${id}`);
                this.form = response.data;
                this.editingId = id; // 记录编辑的货物ID
            } catch (error) {
                ElMessage.error('获取货物信息失败');
            }
        },
        async submit() {
            try {
                if (this.editingId) {
                    await axiosInstance.put(`/api/goodsList/${this.editingId}`, this.form);
                    this.resetForm()
                    ElMessage.success('货物信息已更新');
                } else {
                    await axiosInstance.post('/api/goodsList', this.form);
                    this.resetForm()
                    ElMessage.success('货物已创建');
                }
                this.fetchGoods(); // 刷新列表
            } catch (error) {
                ElMessage.error('提交失败');
            }
        },
        resetForm() {
            this.isEdit = false;
            this.form = {
                GoodsName: '',
                CustomerID: '',
                EntryDate: '',
            };
        },
    },
    mounted() {
        this.resetForm()
        this.fetchGoods(); // 组件挂载时获取货物数据
    },
};
</script>

<style lang="scss">
#goodsManage {
    width: 100%;
    margin-top: 20px;

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