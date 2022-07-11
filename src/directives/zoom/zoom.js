import * as d3 from 'd3-zoom'
import * as d3S from 'd3-selection'

const zoomDirective = {}
zoomDirective.install = Vue => {  


  Vue.directive('sinotruk-zoom', {
    inserted: function(el, binding){
      if(!el.id){
        el.id = 'id' + Math.floor((1+Math.random()) * new Date().getTime()) // 生成随机id
      }
      // 初始化
      zoomDirective[el.id] = {
        zoom: null,
        start: { clientX: 0, clientY: 0},
        end: { currOffsetX: 0, currOffsetY: 0},
        type: el.nodeName
      }
      console.log(el, 'el')
      const style = el.getAttribute('style') ? el.getAttribute('style'): ''// 保留内联样式
      let target = d3S.select(`#${el.id}`)
      let zoom = d3.zoom()
      
      zoom.on('start', event => {
        if(event.sourceEvent){
          zoomDirective[el.id].start.clientX = event.sourceEvent.clientX
          zoomDirective[el.id].start.clientY = event.sourceEvent.clientY
          target.style('cursor', 'move')
        }
      })
      zoom.on('zoom', event => {
        // svg 另作处理
        if(zoomDirective[el.id].type == 'svg'){
          const child = d3S.selectAll(`#${el.id} g`)
          child.attr('transform', event.transform)
          return
        }
        if(event.sourceEvent){
          const movedX = event.sourceEvent.clientX - zoomDirective[el.id].start.clientX
          const movedY = event.sourceEvent.clientY - zoomDirective[el.id].start.clientY
          const offsetX = zoomDirective[el.id].end.currOffsetX + movedX
          const offsetY = zoomDirective[el.id].end.currOffsetY + movedY
          const computedX = Math.floor(offsetX/event.transform.k)
          const computedY = Math.floor(offsetY/event.transform.k)
          target.attr('style', `transform:scale(${event.transform.k}) 
                      translate(${computedX}px, ${computedY}px);
                      transition: transform ease 0.05s; 
                      cursor: move;
                      ${style}`)
          // console.log(`X:${offsetX}, Y:${offsetY}`)
        }
      })
      zoom.on('end', event => {
        if(event.sourceEvent){
          const clientX = event.sourceEvent.clientX - zoomDirective[el.id].start.clientX
          const clientY = event.sourceEvent.clientY - zoomDirective[el.id].start.clientY

          zoomDirective[el.id].end.currOffsetX += clientX
          zoomDirective[el.id].end.currOffsetY += clientY

          target.style('cursor', 'auto')
        }
      })
      zoomDirective[el.id].zoom = zoom
      // 支持自定义缩放范围
      if(binding.value && binding.value instanceof Array){
        zoom.scaleExtent(binding.value)
      } else if( binding.value && !(binding.value instanceof Array)){
        throw new Error(`invalid type of directive param, need Array[min,max], got ${typeof binding.value}`)
      }
      // 为父元素设置超出边界内容隐藏
      const parent = document.querySelector(`#${el.id}`).parentElement
      parent.style.overflow = 'hidden'

      // target.call(zoom).call(zoom.transform, d3.zoomIdentity)
      target.call(zoom)
    },
    update: function(el, binding){
      if(binding.value && binding.value instanceof Array && binding.value !== binding.oldValue){
        // 更新缩放范围
        zoomDirective[el.id].zoom.scaleExtent(binding.value)
      } else if( binding.value && !(binding.value instanceof Array)){
        throw new Error(`invalid type of directive param, need Array[min,max], got ${typeof binding.value}`)
      } 
    },
    unbind: function(el){
      zoomDirective[el.id] = undefined
    }
  })
}

export default zoomDirective