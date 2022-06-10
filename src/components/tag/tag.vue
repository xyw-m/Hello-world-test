<template>
  <div class="playground">
    <div class="tri">
      <div class="tri_top">
        tag
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tag'
})
export default class tag extends Vue {}
</script>
<style lang="scss" scoped>
.tri {
  div {
    width: 150px;
    height: 100px;
    // background: #FFCCCC;
    border-radius: 8px;
    margin: 50px;
    position: relative;
    float: left;
    border: 1px solid #FFCCCC;
  }
  .tri_top {
    // 实心三角形
    &:before {
      content: '';
      width: 0px;
      height: 0px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #FFCCCC;
      position: absolute;
      top: -10px;
      left: 50px;
    }
    &::after {
      content: '';
      width: 0px;
      height: 0px;
      border-left: 9px solid transparent;
      border-right: 9px solid transparent;
      border-bottom: 9px solid #FFFFFF;
      position: absolute;
      top: -9px;
      left: 51px;
    }
  }
}
</style>