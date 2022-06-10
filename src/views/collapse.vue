<template>
  <div class="collapse">
    <sinotruk-collapse :dataList="dataList" accordion>
      <template #title="slotProps">
        {{ slotProps.item.title }}<i v-if="slotProps.item.title" class="header-icon el-icon-info"></i>
      </template>
      <template #content="{ item }">
        {{ item.content }}
      </template>
    </sinotruk-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SinotrukCollapse from '@/components/sinotruk-collapse.vue'
@Component({
  name: 'collapse',
  components: {SinotrukCollapse}
})
export default class collaps extends Vue {
  dataList = [
    { name: 1, content: '内容内容内容', title: '禁用', disabled: null },
    { name: 2, content: '文本文本文本', title: '标题' },
    { name: 3, content: '用来表示被截断的文本。字符串内容将被添加在内容区域中，所以会减少显示出的文本。如果空间太小到连省略号都容纳不下，那么这个字符串也会被截断。', title: '标题' },
    { name: 4, title: null, content: null, disabled: null, a:1}
  ]

  handleChange(activeNames:any){
    console.log(activeNames, 'outer')
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