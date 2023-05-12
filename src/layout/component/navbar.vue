<template>
  <div class="navbar">
    <div class="logo">
      <img src="@/assets/coffee.png" />
      <img src="@/assets/helloworld.png" style="margin-top: -15px" />
    </div>
    <el-menu mode="horizontal" :default-active="activeIndex" class="menu">
      <el-menu-item index="0">指南</el-menu-item>
      <el-menu-item index="1">组件</el-menu-item>
      <el-menu-item index="2">框架</el-menu-item>
      <el-menu-item index="3">文档</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  .logo {
    display: flex;
    align-items: center;
    margin: 0 120px;
  }
  .menu {
    // width: 40vw;
    // background: transparent;
    // border-bottom: none;
    // ::v-deep .el-menu-item{
    //   color: #000000;
    //   font-weight: 700;
    //   &.is-active {
    //     border-bottom: 2px solid #fff;
    //     background: #AAFFEE;
    //   }
    // }
  }
}
</style>
