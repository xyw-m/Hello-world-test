<template>
  <div class="playground">
    <list :data="data" listStyle="noBorder"> </list>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import list from '@/components/list/list.vue';

@Component({
  name: 'playground',
  components: { list },
})
export default class playground extends Vue {
  // data = [
  //   { title: '标题', content: '文本内容文本内容文本内容', img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' },
  //   { title: '标题', content: '文本内容文本内容文本内容' , img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
  //   { title: '标题', content: '文本内容文本内容文本内容', img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' },
  // ]
  data = [
    {
      content:
        '用来表示被截断的文本。字符串内容将被添加在内容区域中，所以会减少显示出的文本。如果空间太小到连省略号都容纳不下，那么这个字符串也会被截断。',
      suffix: '查看详情',
    },
    { content: '文本内容文本内容文本内容' },
    {
      content:
        '用来表示被截断的文本。字符串内容将被添加在内容区域中，所以会减少显示出的文本。如果空间太小到连省略号都容纳不下，那么这个字符串也会被截断。',
    },
  ];
  // data = [
  //   { title: undefined, suffix: true, img: {src: ''}},
  //   { title: '1', content: null },
  //   { title: null, content: undefined, img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'},
  //   { title: undefined, content: "", img:undefined, suffix: true},
  //   { content: '11', img: { src: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', lazy: true}}
  // ]
}
</script>
<style lang="scss" scoped>
.playground {
  padding: 20px;
  width: 500px;
  border: 1px solid #ffcccc;
}
</style>
