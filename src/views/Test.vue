<template>
  <div>
    svg
    <div v-html="svg"></div>
  </div>
</template>
<script>
import { svg } from './tmp';

export default {
  data() {
    return {
      svg: '',
    };
  },
  methods: {
    init() {
      const s = svg;
      const idx = s.indexOf('<defs>') + 6;
      const s1 = s.substring(0, idx);
      const s2 = s.substring(idx);
      const marked =
        '<marker id="marked" viewBox="0 0 20 20" refX="11" refY="10" markerWidth="10" markerHeight="10" orient="auto"><path d="M 1 5 L 11 10 L 1 15 Z" style="fill: red; stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; stroke: red;"/></marker>';
      this.svg = s1 + marked + s2;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
