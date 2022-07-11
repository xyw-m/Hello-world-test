<template>
    <div class="main-container">
        <!-- <div class="svgContainer" id="con1">
            <h1>panzoom包</h1>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg1">
                <g  style="stroke: blue; fill: blue;" id="g">
                <rect x="5%" y="5%" width="90%" height="90%" rx="10" ry="10" 
                        style="fill: none; stroke-width: 2px;"/>
                <text x="50%" y="97.2%" style="text-anchor: middle;">
                    This text is going to get extremely small.
                </text>
                <text x="95.4%" y="50%" style="writing-mode: tb; text-anchor: middle;">
                    The <tspan style="stroke: red;">red</tspan> center dot is to the left.
                </text>
                <text x="3.3%" y="50%" style="writing-mode: tb; text-anchor: middle;">
                    The <tspan style="stroke: red; fill: red;">red</tspan> center dot is to the right.
                </text>
                </g>
            </svg>
        </div> -->
        <!-- <div>
            <h1>d3-zoom实现</h1>
            <div
                id="svgContainer"
                class="svgContainer">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg" >
                    <g id="g1" style="stroke: blue; fill: blue;">
                        <rect x="10" y="10" width="100" height="100"/>
                        <text>what?</text>
                    </g>
                    <g  style="stroke: blue; fill: red;">
                        <circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red" />
                    </g>
                    <g id="g2" style="stroke: blue; fill: blue;">
                        <circle cx="50" cy="20" r="40" stroke="black" stroke-width="2" fill="greed" />
                    </g>
                </svg>
            </div>
        </div> -->
        <!-- <div>
            <el-select
                v-model="value"
                filterable
                remote
                :remote-method="remoteMethod">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
        </div> -->
        <!-- <markdown-it-vue :content="content"/> -->
        <!-- <test class="markdown-body"></test> -->
        <router-view></router-view>
        <div class="child-app-container">
            <div id="child-container"></div>
        </div>
        <!-- <about></about> -->
        <!-- <update-hooks></update-hooks> -->
    </div>
</template>
<script lang="js">
import { Component, Vue } from 'vue-property-decorator'
// import MarkdownItVue from 'markdown-it-vue'
// import 'markdown-it-vue/dist/markdown-it-vue.css'
import panzoom from 'panzoom'
import * as d3 from 'd3-zoom'
import * as d3S from "d3-selection"
import About from '@/views/About.vue'
import updateHooks from '@/views/updateHooks.vue'
@Component({
    components: { About, updateHooks},
    name: 'AppMain'
})
export default class AppMain extends Vue {
    name = 'appMain'
    startX = 0
    startY = 0
    // options:any = []
    value = ''
    show = false

    mounted(){
        // d3-zoom
        // let svg2 = d3S.select<SVGSVGElement, unknown>('#svg')
        // let child = d3S.selectAll('#svg g')
        // let zoom = d3.zoom<SVGSVGElement, unknown>()
        //                 .on("zoom", (event: any) => {
        //                     child.attr(
        //                         "transform",
        //                         event.transform
        //                     )
        //                 });
        // svg2.call(zoom)
        // // panzoom
        // let g:any = document.getElementById('parentGraphic')
        // let svg:any = document.getElementById('svg1')
        // panzoom(svg,{
        //     bounds: true,
        //     boundsPadding: 0.6
        // })
        // // test body
        // let body = document.querySelector('body')
        // body?.addEventListener('click', (event: any) => {
        //     console.log(event, 'body click')
        //     throw new Error("error")
        // })
        // let svgDoc = document.querySelector('#svg')
        // svgDoc?.addEventListener('mouseDown', (event: any) => {
        //     console.log(event, "svg mouseDown")
        // })



    }

    // remoteMethod(query:any){
    //     if(query != ''){
    //         this.options = [
    //             {
    //                 value: '11',
    //                 label: '11'
    //             },
    //             {
    //                 value: '22',
    //                 label: '22'
    //             }
    //         ]
    //     }
    // }

    // wheel(event: any){
    //     let svg = document.getElementById('svgContainer')
    //     if(event.deltaY > 0){
    //         this.zoom("in", svg)
    //     } else {
    //         this.zoom("out", svg)
    //     }
        
    // }

    // mouseDown(event: any){
    //     this.startX = event.clientX
    //     this.startY = event.clientY
    // }

    // mouseUp(event: any){
    //     console.log(event.clientX, event.clientY, "mouseUp clientX")
    //     let dx = event.clientX - this.startX;
    //     let dy = event.clientY - this.startY;
    //     let svg = document.getElementById('svgContainer');
    //     this.pan(svg, dx, dy)
    // }

    // zoom(direction: string, svg: any){
    //     const {scale, x, y} = this.getTransformParameters(svg)
    //     console.log({scale, x, y}, "{scale, x, y}")
    //     let dScale = 0.1;
    //     if(direction == "out")
    //         dScale *= -1
    //     if(scale == 0.1 && direction == "out")
    //         dScale = 0;
    //     svg.style.transform = this.getTransformString(scale + dScale, x, y)
    //     console.log(this.getTransformString(scale + dScale, x, y), "getTransformString")
    // }

    // pan(svg: any, dx: number, dy: number){
    //     const { scale, x, y} = this.getTransformParameters(svg)
    //     svg.style.transform = this.getTransformString(scale, dx, dy)
    //     console.log(dx, dy)
    //     console.log(svg.style.transform)
    // }

    // getTransformParameters(element: any){
    //     const transform = element.style.transform;
    //     let scale = 1,
    //         x = 0,
    //         y = 0;
    //     if(transform.includes('scale'))
    //         scale = parseFloat(transform.slice(transform.indexOf('scale') + 6))
    //     if(transform.includes("translateX"))
    //         x = parseInt(transform.slice(transform.indexOf('translateX') + 11))
    //     if(transform.includes("translateY"))
    //         y = parseInt(transform.slice(transform.indexOf('translateX') + 11))
    //     return {scale, x, y}
    // }

    // getTransformString(scale: any, x: any, y:any){
    //     return "scale(" + scale + ")" + "translateX(" + x + "px) translateY(" + y + "px)";
    // }
}
</script>
<style lang="scss" scoped>
.main-container {
    position: relative;
    height: 100vh;
    margin-left:220px;
    font-size: 10px;
    line-height: 1.5;
}
p {
    margin-left: auto;
    margin-right: auto;
    margin-top: 25%;
    margin-bottom: 25%;
    width: 1000px;
    line-height: 1.5;
    font-size: 30px;
}
span {
    padding-top: 10px;
    border: 1px solid
}
#svgContainer {
    user-select: none;
}
.svgContainer {
    // overflow: hidden;
    width: 500px;
    border: 1px solid 
}
</style>