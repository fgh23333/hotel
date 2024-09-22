<template>
    <div id="warehouseManage">
        <div class="manageCover">
            <h2 class="manageTitle">仓库管理</h2>
            <div class="manageForm">
                <el-form :model="form" ref="formRef" label-width="120px">
                    <el-form-item label="货物名称">
                        <el-select v-model="form.GoodsID" placeholder="请选择货物">
                            <el-option v-for="item in goodsList" :key="item.GoodsID" :label="item.GoodsName"
                                :value="item.GoodsID"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入库日期">
                        <el-date-picker v-model="form.EntryDate" type="date" placeholder="选择日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item label="出库日期">
                        <el-date-picker v-model="form.ExitDate" type="date" placeholder="选择日期" style="width: 100%" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">提交</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
                <el-table :data="warehouses" style="width: 100%">
                    <el-table-column prop="WarehouseID" label="仓库ID" width="100" />
                    <el-table-column prop="GoodsName" label="货物名称" />
                    <el-table-column prop="EntryDate" label="入库日期" />
                    <el-table-column prop="ExitDate" label="出库日期" />
                    <el-table-column label="操作" width="180">
                        <template #default="{ row }">
                            <el-button @click="editWarehouse(row.WarehouseID)" type="text" size="small">编辑</el-button>
                            <el-button @click="deleteWarehouse(row.WarehouseID)" type="text" style="color: red"
                                size="small">删除</el-button>
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
    name: 'WarehouseManagement',
    data() {
        return {
            warehouses: [], // 仓库记录列表
            goodsList: [], // 货物列表，用于选择货物
            form: {
                WarehouseID: null,
                GoodsID: '',
                EntryDate: '',
                ExitDate: '',
            },
            editingId: null, // 当前编辑的仓库ID
        };
    },
    methods: {
        // 获取仓库记录
        async fetchWarehouses() {
            try {
                const response = await axiosInstance.get('/api/warehouse');
                this.warehouses = response.data;
            } catch (error) {
                ElMessage.error('获取仓库记录失败');
            }
        },
        // 获取货物列表
        async fetchGoods() {
            try {
                const response = await axiosInstance.get('/api/goods');
                this.goodsList = response.data;
            } catch (error) {
                ElMessage.error('获取货物列表失败');
            }
        },
        // 标记删除仓库记录
        async deleteWarehouse(id) {
            try {
                await axiosInstance.delete(`/api/warehouse/${id}`);
                ElMessage.success('仓库记录已标记删除');
                this.fetchWarehouses(); // 刷新列表
            } catch (error) {
                ElMessage.error('删除仓库记录失败');
            }
        },
        // 提交表单（新增或编辑）
        async submit() {
            try {
                if (this.editingId) {
                    // 编辑
                    await axiosInstance.put(`/api/warehouse/${this.editingId}`, this.form);
                    ElMessage.success('仓库信息已更新');
                } else {
                    // 新增
                    await axiosInstance.post('/api/warehouse', this.form);
                    ElMessage.success('仓库记录已创建');
                }
                this.dialogVisible = false;
                this.fetchWarehouses(); // 刷新列表
            } catch (error) {
                ElMessage.error('提交失败');
            }
        },
        // 重置表单
        resetForm() {
            this.form = {
                WarehouseID: null,
                GoodsID: '',
                EntryDate: '',
                ExitDate: '',
            };
        },
    },
    mounted() {
        this.fetchWarehouses();
        this.fetchGoods();
    },
};
</script>