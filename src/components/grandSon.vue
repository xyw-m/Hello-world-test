<template>
  <div class="grandSon">
    <p>grandSon is a great dancer</p>
    <p>type music, and he will dance with《{{ music }}》for you</p>
    <el-button @click="$emit('dance', music)">dance</el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'grandSon',
})
export default class grandSon extends Vue {
  @Prop() private music!: string;
}
</script>
