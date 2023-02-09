<template>
  <div class="zoom" id="zoom">
    <div>
      <h1>d3-zoom实现</h1>
      <div id="svgContainer" class="svgContainer">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg">
          <g id="g1" style="stroke: blue; fill: blue">
            <rect x="10" y="10" width="100" height="100" />
            <text>what?</text>
          </g>
          <g style="stroke: blue; fill: red">
            <circle
              cx="100"
              cy="50"
              r="40"
              stroke="black"
              stroke-width="2"
              fill="red"
            />
          </g>
          <g id="g2" style="stroke: blue; fill: blue">
            <circle
              cx="50"
              cy="20"
              r="40"
              stroke="black"
              stroke-width="2"
              fill="greed"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3-zoom';
import * as d3S from 'd3-selection';

export default {
  data() {
    return {
      extent: [0.5, 2],
    };
  },
  mounted() {
    // svg
    // let svg2 = d3S.select('#svg')
    // let child = d3S.selectAll('#svg g')
    // let zoom = d3.zoom()
    //                 .on("zoom", (event) => {
    //                     child.attr(
    //                         "transform",
    //                         event.transform
    //                     )
    //                     console.log(event.transform)
    //                 });
    // svg2.call(zoom)
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.zoom {
  padding: 50px;
}
#singleDom {
  width: 200px;
  height: 200px;
  border: 2px solid #ff8888;
}
#forDirectives {
  width: 200px;
  height: 200px;
  border: 2px dotted #99bbff;
  margin-top: 20px;
}
</style>
