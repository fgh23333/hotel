<template>
  <div id="app">
    <el-container>
      <el-header>宾馆管理系统</el-header>
      <el-menu :default-active="activeMenu" mode="horizontal" @select="handleMenuSelect">
        <el-menu-item index="1">主页</el-menu-item>
        <el-menu-item index="2">房间管理</el-menu-item>
        <el-menu-item index="3">预订管理</el-menu-item>
        <el-menu-item index="4">入住管理</el-menu-item>
        <el-menu-item index="5">财务管理</el-menu-item>
      </el-menu>
      <router-view />
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: '1',
    };
  },
  methods: {
    handleMenuSelect(key) {
      switch (key) {
        case '1':
          this.$router.push('/');
          break;
        case '2':
          this.$router.push('/rooms');
          break;
        case '3':
          this.$router.push('/bookings');
          break;
        case '4':
          this.$router.push('/check-ins');
          break;
        case '5':
          this.$router.push('/financials');
          break;
      }
    },
  },
};
</script>
