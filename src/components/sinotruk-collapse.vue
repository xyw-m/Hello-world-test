<template>
  <div class="sinotruk-collapse">
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
      :accordion="accordion"
    >
      <el-collapse-item
        v-for="(item, index) in dataList"
        :key="index"
        :name="item.name"
        :disabled="item.disabled ? item.disabled : false"
        class="collapse-item"
      >
        <template #title>
          <div class="title">
            <slot name="title" :item="item">{{ item.title }}</slot>
          </div>
        </template>
        <slot name="content" :item="item">
          <div class="collapse-item_content">{{ item.content }}</div>
        </slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'SinotrukCollapse',
})
export default class SinotrukCollapse extends Vue {
  @Prop() private dataList!: Array<unknown>;
  @Prop({ default: false }) private accordion!: boolean;

  activeNames = [];

  // 当前激活面板改变时触发，参数为当前激活面板的names数组
  handleChange(activeNames: any): void {
    this.$emit('change', activeNames);
  }
}
</script>
<style lang="scss">
.sinotruk-collapse .el-collapse-item__header {
  border: none;
  &:hover {
    color: #0a7cff;
  }
  padding: 0 6px 0 16px;
  &:hover {
    background-color: #f8f8f8;
  }
}

.sinotruk-collapse .el-collapse {
  border: none;
}

.sinotruk-collapse .el-collapse-item__header.is-active {
  color: #0066ff;
}

.sinotruk-collapse .el-collapse-item__header .el-collapse-item__arrow {
  transform: rotate(90deg);
}

.sinotruk-collapse
  .el-collapse-item__header.is-active
  .el-collapse-item__arrow.is-active {
  transform: rotate(270deg);
}

.sinotruk-collapse .el-collapse-item__header.is-active {
  &:hover {
    background-color: #ffffff;
  }
}
.collapse-item_content {
  text-align: left;
}
.sinotruk-collapse .collapse-item {
  border: 1px solid #dddddd;
  border-bottom: none;
  &:last-child {
    border-bottom: 1px solid #dddddd;
  }
  &:hover {
    background-color: #f8f8f8;
  }
  .title {
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
  }
}
</style>
