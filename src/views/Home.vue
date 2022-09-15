<template>
  <div class="home">
    <el-button @click="show = !show">click</el-button>
    <el-button @click="visible = !visible">自定义</el-button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
  <transition name="custom">
    <span v-show="visible">what hell?</span>
  </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  show = false
  visible = false
}
</script>
<style lang="scss" scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active,  .slide-fade-leave-active{
  transition: all .3s ease;
}
// .slide-fade-leave-active {
//   transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  // transform: translateX(10px);
  opacity: 0;
}

.custom-enter, .custom-leave-to {
  opacity: 0;
}

.custom-enter-active, .custom-leave-active {
  transition: all 2s ease;
}
</style>