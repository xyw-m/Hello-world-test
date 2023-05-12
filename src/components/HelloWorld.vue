<template>
  <div class="hello">
    <el-button @click="handleClick">打印属性</el-button>
    <el-button @click="$emit('sing', 'sing a song')">触发sing事件</el-button>
    <p>{{ $attrs.tempProp }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  handleClick() {
    console.log(this.$props, 'props');
    console.log(this.$attrs, 'attrs');
    console.log(this.$listeners, 'listeners');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
