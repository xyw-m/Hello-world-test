<template>
  <div class="side-container">
    <el-menu default-active="1" router class="menu">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>日志</span>
        </template>
        <el-menu-item index="/updateLog">更新日志</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>组件</span>
        </template>
        <el-menu-item
          v-for="(menu, index) in menuList"
          :key="index"
          :index="menu.path"
        >
          <template #title>
            <span>{{ menu.title }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import menuConfig from '@/menuConfig/config.json';

@Component({
  name: 'Aside',
})
export default class Aside extends Vue {
  get menuList() {
    const sidebarMenu: any = [];
    const formattedMenu = function (arr: any) {
      arr.forEach((item: any) => {
        if (item.path) {
          sidebarMenu.push({
            title: item.title,
            path: item.path,
          });
        } else if (item.groups) {
          formattedMenu(item.groups);
        }
      });
    };
    formattedMenu(menuConfig);
    return sidebarMenu;
  }
}
</script>
<style lang="scss" scoped>
// .side-container {
//   position: fixed;
//   width: 220px;
//   height: 100vh;
//   top: 0;
//   left: 0;
// }
.menu {
  width: 200px;
  min-height: calc(100vh - 120px);
}
</style>
