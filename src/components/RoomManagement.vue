<template>
  <el-container>
    <el-header>房间管理</el-header>
    <el-main>
      <el-table :data="rooms" style="width: 100%">
        <el-table-column prop="roomNumber" label="房间号"></el-table-column>
        <el-table-column prop="type" label="房间类型"></el-table-column>
        <el-table-column prop="price" label="价格" width="120"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    rooms: {
      type: Array,
      default: [
        { roomNumber: '101', type: '单人间', price: 300, status: '空闲' },
        { roomNumber: '102', type: '单人间', price: 300, status: '已入住' },
        { roomNumber: '103', type: '双人间', price: 400, status: '空闲' },
        { roomNumber: '201', type: '豪华单人间', price: 500, status: '空闲' },
        { roomNumber: '202', type: '双人间', price: 400, status: '已预订' },
        { roomNumber: '203', type: '双人间', price: 400, status: '已入住' }
      ]
    }
  }
};
</script>
