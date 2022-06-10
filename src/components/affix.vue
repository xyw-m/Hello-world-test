<template>
  <div ref="placeholderNode" :style="placeholderStyle" class="">
    <div ref="fixedNode" :style="affixStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { 
  getTargetRect,
  getFixedTop,
  getFixedBottom,
  addObserveTarget,
  removeObserveTarget } from './utils'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component({
  name: 'affix',
  props: {
    target: {
      type: Function,
      default(){
        return typeof window !== 'undefined' ? window : null
      }
    }
  },
  computed: {
    getOffsetTop(){
      const { offsetBottom } = this as any
      let { offsetTop } = this as any
      if(offsetBottom === undefined && offsetTop === undefined){
        offsetTop = 0
      }
      return offsetTop
    },
    getOffsetBottom(){
      return (this as any).offsetBottom
    }
  }
})
export default class affix extends Vue {
  // 距离窗口顶部达到指定偏移量后触发
  @Prop() private offsetTop?:number
  // 距离窗口底部达到指定偏移量后触发
  @Prop() private offsetBottom?:number
  // 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数

  @Watch('target')
  onTargetChange(newVal:any){
    console.log('changed!')
    console.log(newVal, 'newVal')
    let newTarget = null
    if(newVal){
      newTarget = newVal() || null
    }
    if(this.prevTarget !== newTarget){
      removeObserveTarget(this)
      if(newTarget){
        addObserveTarget(newTarget, this)
        this.updatePosition()
      }
      this.prevTarget = newTarget
    }
  }

  @Watch('offsetTop')
  onOffsetTopChange(){
    this.updatePosition()
  }

  @Watch('offsetBottom')
  onOffsetBottomChange(){
    this.updatePosition()
  }

  affixStyle:any = {}
  placeholderStyle:any = {}
  lastAffix = false
  prevTarget = null
  timeout:any
  status = ""

  mounted(){
    const { target } = (this as any)
    if(target){
      // Wait for parent component ref has its value
      this.timeout = setTimeout(() => {
        console.log(target(), 'target')
        addObserveTarget(target(), this)
        this.updatePosition()
      })
    }
  }

  updated(){
    // console.log('update run')
    // this.measure()
  }

  beforeDestroy(){
    clearTimeout(this.timeout)
    removeObserveTarget(this)
  }

  prepareMeasure(){
    this.affixStyle = undefined
    this.placeholderStyle = undefined
    this.measure()
    // this.$forceUpdate()
  }

  measure(){
    const { lastAffix, target } = this as any
    if(!this.$refs.fixedNode || !this.$refs.placeholderNode || !target){
      return
    }

    const offsetTop = (this as any).getOffsetTop
    const offsetBottom = (this as any).getOffsetBottom
    const targetNode = target()
    
    if(!targetNode){
      return
    }
    const targetRect = getTargetRect(targetNode)
    const placeholderRect = getTargetRect(this.$refs.placeholderNode)
    const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop)
    const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom)
    if(fixedTop !== undefined){
      this.status = 'sinotruk-affix'
      this.affixStyle = {
        position: 'fixed',
        top: fixedTop,
        width: placeholderRect.width + 'px',
        height: placeholderRect.height + 'px'
      }
      this.placeholderStyle = {
        width: placeholderRect.width + 'px',
        height: placeholderRect.height + 'px'
      }
    } else if (fixedBottom !== undefined){
      this.status = 'sinotruk-affix'
      this.affixStyle = {
        position: 'fixed',
        bottom: fixedBottom,
        width: placeholderRect.width + 'px',
        height: placeholderRect.height + 'px'
      }
      this.placeholderStyle = {
        width: placeholderRect.width + 'px',
        height: placeholderRect.height + 'px'
      }
    }
    this.lastAffix = !! this.affixStyle
    if(lastAffix !== this.lastAffix){
      this.$emit('change', this.lastAffix)
    }
  }

  updatePosition(){
    this.prepareMeasure()
  }

  lazyUpdatePosition(){
    const { target, affixStyle } = this as any
    // Check position change before measure to make Safari smooth
    if(target && affixStyle){
      const offsetTop = (this as any).getOffsetTop
      const offsetBottom = (this as any).getOffsetBottom
      const targetNode = target()

      if(targetNode && this.$refs.placeholderNode){
        const targetRect = getTargetRect(targetNode)
        const placeholderRect = getTargetRect(this.$refs.placeholderNode)
        const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop)
        const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom)

        if(
          (fixedTop !== undefined && affixStyle.top === fixedTop) || 
          (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
        ){
          return 
        }
      }
    }
    this.prepareMeasure()
  }
}
</script>
<style lang="scss" scoped>
.sinotruk-affix {
  position: fixed;
  z-index: 10;
}
</style>