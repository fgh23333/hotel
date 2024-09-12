<template>
  <el-container>
    <el-header>财务管理</el-header>
    <el-main>
      <el-descriptions border column="1">
        <el-descriptions-item label="今日收入">{{ financeStats.todayIncome }} 元</el-descriptions-item>
        <el-descriptions-item label="本月收入">{{ financeStats.monthIncome }} 元</el-descriptions-item>
        <el-descriptions-item label="未结账金额">{{ financeStats.pendingAmount }} 元</el-descriptions-item>
        <el-descriptions-item label="总收入">{{ financeStats.totalIncome }} 元</el-descriptions-item>
      </el-descriptions>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    financeStats: {
      type: Object,
      default: {
        todayIncome: 8000,
        monthIncome: 150000,
        pendingAmount: 12000,
        totalIncome: 160000
      }
    }
  }
};
</script>
