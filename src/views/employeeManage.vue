<template>
    <div id="employeeManage">
        <div class="manageCover">
            <h2 class="manageTitle">员工管理</h2>
            <div class="manageForm">
                <el-form :model="employeeForm" :rules="rules" ref="employeeFormRef" label-width="100px">
                    <el-form-item label="姓名" prop="EmployeeName">
                        <el-input v-model="employeeForm.EmployeeName" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="Gender">
                        <el-select v-model="employeeForm.Gender" placeholder="请选择性别">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="BirthDate">
                        <el-date-picker v-model="employeeForm.BirthDate" type="date"
                            placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="职位" prop="Position">
                        <el-input v-model="employeeForm.Position" placeholder="请输入职位"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="PhoneNumber">
                        <el-input v-model="employeeForm.PhoneNumber" placeholder="请输入电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="Address">
                        <el-input v-model="employeeForm.Address" placeholder="请输入地址"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">{{ isEdit ? '更新员工' : '添加员工' }}</el-button>
                        <el-button @click="resetForm">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="manageTable">
                <el-table :data="employees" style="width: 100%; margin-top: 20px">
                    <el-table-column prop="EmployeeID" label="ID" min-width="80"></el-table-column>
                    <el-table-column prop="EmployeeName" label="姓名"></el-table-column>
                    <el-table-column label="性别">
                        <template #default="scope">{{ gender[scope.row.Gender] }}</template>
                    </el-table-column>
                    <el-table-column prop="Position" label="职位"></el-table-column>
                    <el-table-column prop="Address" label="地址"></el-table-column>
                    <el-table-column prop="PhoneNumber" label="电话"></el-table-column>
                    <el-table-column prop="BirthDate" label="出生日期"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <el-button size="small" @click="editEmployee(scope.row)">编辑</el-button>
                            <el-button size="small" type="danger"
                                @click="deleteEmployee(scope.row.EmployeeID)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
    data() {
        return {
            employees: [], // 员工列表
            employeeForm: {
                EmployeeName: "",
                Gender: "",
                BirthDate: "",
                Position: "",
                PhoneNumber: "",
                Address: "",
            },
            isEdit: false, // 是否为编辑模式
            editEmployeeID: null,
            rules: {
                EmployeeName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
                Gender: [{ required: true, message: "请选择性别", trigger: "change" }],
                BirthDate: [{ required: true, message: "请选择出生日期", trigger: "change" }],
                Position: [{ required: true, message: "请输入职位", trigger: "blur" }],
                PhoneNumber: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
                Address: [{ required: true, message: "请输入地址", trigger: "blur" }],
            },
            gender: {
                0: '未知',
                1: '男',
                2: '女'
            }
        };
    },
    methods: {
        // 获取员工信息
        async fetchEmployees() {
            try {
                let response = await axiosInstance.get("/api/employee");
                for (let i = 0; i < response.data.data.length; i++) {
                    response.data.data[i].BirthDate = new Date(response.data.data[i].BirthDate).toISOString().slice(0, 10);
                }
                this.employees = response.data.data;
            } catch (error) {
                console.error("获取员工列表失败", error);
            }
        },
        // 提交表单（添加或更新员工）
        async submitForm() {
            this.$refs.employeeFormRef.validate(async (valid) => {
                if (valid) {
                    try {
                        if (this.isEdit) {
                            await axiosInstance.put(`/api/employee/${this.editEmployeeID}`, this.employeeForm);
                            this.$message.success("员工信息更新成功");
                        } else {
                            await axiosInstance.post("/api/employee", this.employeeForm);
                            this.$message.success("员工添加成功");
                        }
                        this.resetForm();
                        this.fetchEmployees();
                    } catch (error) {
                        console.error("提交员工信息失败", error);
                    }
                }
            });
        },
        // 编辑员工
        editEmployee(employee) {
            this.isEdit = true;
            this.editEmployeeID = employee.EmployeeID;
            this.employeeForm = { ...employee };
        },
        // 删除员工
        async deleteEmployee(id) {
            try {
                await axiosInstance.delete(`/api/employee/${id}`);
                this.$message.success("员工删除成功");
                this.fetchEmployees();
            } catch (error) {
                console.error("删除员工失败", error);
            }
        },
        // 重置表单
        resetForm() {
            this.isEdit = false;
            this.editEmployeeID = null;
            this.employeeForm = {
                EmployeeName: "",
                Gender: "",
                BirthDate: "",
                Position: "",
                PhoneNumber: "",
                Address: "",
            };
            this.$refs.employeeFormRef.resetFields();
        },
    },
    mounted() {
        this.fetchEmployees(); // 页面加载时获取员工列表
    },
};
</script>

<style lang="scss">
#employeeManage {
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