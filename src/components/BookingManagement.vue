<template>
  <el-container>
    <el-header>预订管理</el-header>
    <el-main>
      <el-table :data="bookings" style="width: 100%">
        <el-table-column prop="customerName" label="顾客姓名"></el-table-column>
        <el-table-column prop="roomNumber" label="房间号"></el-table-column>
        <el-table-column prop="bookingDate" label="预订日期"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    bookings: {
      type: Array,
      default: [
        { customerName: '张三', roomNumber: '202', bookingDate: '2024-09-15', status: '已预订' },
        { customerName: '李四', roomNumber: '103', bookingDate: '2024-09-16', status: '已预订' }
      ]
    }
  }
};
</script>
