<template>
  <div class="child">
    <grand-son v-bind="$attrs" v-on="$listeners"></grand-son>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import grandSon from './grandSon.vue';

@Component({
  name: 'child',
  components: { grandSon },
})
export default class child extends Vue {}
</script>
