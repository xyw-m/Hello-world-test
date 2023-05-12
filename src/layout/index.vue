<template>
  <div class="layout">
    <navbar></navbar>
    <div class="main">
      <sidebar></sidebar>
      <div class="app-main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import navbar from './component/navbar.vue';
import sidebar from './component/Aside.vue';

export default {
  name: 'layout',
  components: { navbar, sidebar },
};
</script>

<style lang="scss" scoped>
.layout {
  background: #eee;
  .main {
    background: #fff;
    width: 90%;
    margin: 30px auto 20px;
    border-radius: 6px;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    .app-main {
      padding: 20px;
      flex-grow: 1;
    }
  }
}
</style>
