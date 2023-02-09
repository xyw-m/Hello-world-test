<template>
  <div>
    <div class="listViews">
      <sinotruk-list
        :data="data"
        :type="valueType"
        :size="valueSize"
      ></sinotruk-list>
    </div>
    <el-select v-model="valueType">
      <el-option
        v-for="op in types"
        :key="op"
        :value="op"
        :label="op"
      ></el-option>
    </el-select>
    <el-select v-model="valueSize">
      <el-option
        v-for="op in options"
        :key="op"
        :value="op"
        :label="op"
      ></el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import sinotrukList from '@/components/sinotrukList/sinotrukList.vue';

@Component({
  name: 'list',
  components: { sinotrukList },
})
export default class list extends Vue {
  data = [
    {
      content:
        '用来表示被截断的文本。字符串内容将被添加在内容区域中所以会减少显示出的文本。如果空间太小到连省略号都容纳不下，那么这个字符串也会被截断。',
      suffix: '查看详情',
    },
    { content: '文本内容文本内容文本内容' },
    {
      content:
        '用来表示被截断的文本。字符串内容将被添加在内容区域中，所以会减少显示出的文本。如果空间太小到连省略号都容纳不下，那么这个字符串也会被截断。',
    },
  ];
  options = ['small', 'middle', 'large'];
  types = ['noBorder', 'common', 'zebra', 'card'];
  valueSize = 'middle';
  valueType = 'common';
}
</script>
<style lang="scss" scoped>
.listViews {
  width: 500px;
  border: 1px solid #ffcccc;
  padding: 10px 0;
}
</style>
