<template>
  <div>
    <div class="about">
      <h1>This is an about page</h1>
      <div id="affixContainer" style="height:200px;overflow-y:auto">
        <p>11111111</p>
        <x-affix
          ref="affix"
          :offsetTop="top"
          :target="getTarget"
          v-test>
          <button>固钉内容</button>
        </x-affix>
        <pre>
        固钉组件可以将元素钉在可视范围内。

        当内容区域比较长，

        需要滚动页面时，

        固钉组件可以在滚动范围内始终展现，

        常用于侧边菜单和按钮组合。

        注意：当页面可视范围过小时，

        慎用此功能以免遮挡页面内容。
        </pre>
      </div>
    </div>
    <div style="height:200px;overflow-y:auto;width:500px">
      <p>Scroll down the page</p>
      <p v-pin:[direction]="200">I am pinned onto the page at 200px to the {{ direction }}</p>
      <button @click="direction = 'right'"> to Right</button>
      <button @click="direction = 'left'"> to Left</button>
              <pre>
        固钉组件可以将元素钉在可视范围内。

        当内容区域比较长，

        需要滚动页面时，

        固钉组件可以在滚动范围内始终展现，

        常用于侧边菜单和按钮组合。

        注意：当页面可视范围过小时，

        慎用此功能以免遮挡页面内容。
        </pre>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import myMixin from '@/mixins/test.js'
@Component({
  name: 'xywuiTest',
  components: {},
  mixins: [myMixin],
  directives: {
    pin: {
      bind: function(el:any, binding:any, vnode:any){
        el.style.position = 'fixed'
        let s = binding.arg
        el.style[s] = binding.value + 'px'
      },
      componentUpdated: function(el:any, binding:any, vnode:any){
        let s = binding.arg
        el.style.left = ''
        el.style.right = ''
        el.style[s] = binding.value + 'px'
      }
    },
    test: {
      bind: function(el:any, binding:any, vnode:any){
        console.log(el, 'el')
      }
    }
  }
})
export default class xywuiTest extends Vue {
  top = 20
  direction = 'left'

  getTarget(){
    return document.querySelector('#affixContainer')
  }
}
</script>
<style lang="scss" scoped>
.collapse {
  width: 500px;
  margin-left: 20px;
  margin-top: 20px;
}
</style>