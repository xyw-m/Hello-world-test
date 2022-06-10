<template>
  <div class="sinotruk-collapse">
    <el-collapse v-model="activeNames" @change="handleChange" :accordion="accordion">
      <el-collapse-item
        v-for="(item, index) in dataList"
        :key="index"
        :name="item.name"
        :disabled="item.disabled ? item.disabled : false"
        class="collapse-item">
        <template #title>
          <div class="title"><slot name="title" :item="item">
            {{ item.title }}
          </slot></div>
        </template>
        <slot name="content" :item="item">
          <div class="collapse-item_content">{{ item.content }}</div>
        </slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'SinotrukCollapse'
})
export default class SinotrukCollapse extends Vue {
  @Prop() private dataList!: Array<unknown>
  @Prop({default: false}) private accordion!:boolean

  activeNames = []

  // 当前激活面板改变时触发，参数为当前激活面板的names数组
  handleChange(activeNames:any):void{
    this.$emit('change', activeNames)
  }

  isPropertyExist(obj:any, property:string):boolean{
    if(!obj){
      return false
    }
    if(typeof obj !== 'object' || !Object.prototype.hasOwnProperty.call(obj,property)){
      return false
    } else {
      return true
    }
  }
}
</script>
<style lang="scss">
.sinotruk-collapse .el-collapse-item__header {
  &:hover {
    color: 	#0066FF;
  }
}
.sinotruk-collapse .el-collapse-item__header.is-active {
  color: 	#0066FF;
}

.sinotruk-collapse .el-collapse-item__header .el-collapse-item__arrow {
  transform: rotate(90deg);
}

.sinotruk-collapse .el-collapse-item__header.is-active .el-collapse-item__arrow.is-active {
  transform: rotate(270deg);
}
.collapse-item_content {
  text-align: left;
}
</style>
