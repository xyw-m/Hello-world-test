<template>
  <div class="list-container">
    <ul class="list-items" :class="listStyle">
      <li 
        v-for="(item, index) in dataSource"
        :key="index"
        class="list-item">
        <el-image 
          v-if="isPropertyExist(item, 'img')" 
          class="item-img"
          :src="isPropertyExist(item.img, 'src') ? item.img.src : item.img"
          :fit="isPropertyExist(item.img, 'fit') ? item.img.fit : 'fill'"
          :class="isPropertyExist(item.img, 'class')? item.img.class:''"
          :lazy="isPropertyExist(item.img, 'lazy') ? item.img.lazy: false">
        </el-image>
        <div class="item-content">
          <slot name="content" :item="item">
            <h3 v-if="isPropertyExist(item, 'title') && item.title">{{ item.title }}</h3>
            <span class="content-text"><a>{{ isPropertyExist(item, 'content') ? item.content : item }}</a></span>
          </slot>
        </div>
        <div>
          <slot name="suffix" :item="item"></slot>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

interface listItem {
  content?: string
  title?: string
  img?: imgConfig | string
}

interface imgConfig {
  src: string,
  class?: string,
  fit?: string,
  lazy?: boolean
}

@Component({
  name: 'list'
})
export default class list extends Vue {
  @Prop({default:() => []}) private data !: Array<listItem | unknown>
  @Prop({ default: 'common'}) private listStyle !: string // 列表样式，可选值：noBorder | commom | zebra | card

  get dataSource(){
    if(this.data.includes(null) || this.data.includes(undefined)){
      console.log('Null or Undefined Value found in the data, Please check data prop')
    }
    return this.data
  }

  isPropertyExist(obj:any, property:string):boolean{
    if(!obj){
      return false
    }
    if(typeof obj !== 'object' 
        || !Object.prototype.hasOwnProperty.call(obj,property)){
      return false
    } else {
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.list-container {
  width: 100%;
  background-color: #FFFFFF;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1000);
  border-radius: 4px;
  padding: 5px 0;
  .list-items {
    margin: 0;
    padding-inline-start: 0;
    padding-left: 32px;
    .list-item {
      display: flex;
      text-align: left;
      justify-content: space-around;
      align-items: center;
      .item-img {
        width: 100px;
        min-width: 100px;
        height: 100px;
        margin: 5px 5px 5px 0;
      }
      .item-content {
        flex-grow: 1;
        font-size: 12px;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 40px;
        &:hover {
          color: #40a9ff;
          text-decoration: underline;
          cursor: default;
        }
        h3 {
          margin-top: 5px;
          margin-bottom: 0;
        }
        span {
          line-height: 40px;
          white-space: nowrap;
          a {
            color:	#000000;
          }
          a:hover {
            color: #40a9ff;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
.common {
  li {
    border-bottom: 2px solid #DDDDDD;
  }
  li:first-child {
    border-top: 2px solid #DDDDDD;
  }
}
.noBorder {
  .item-img {
    margin-right: 15px;
  }

  .list-item {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      border-radius: 50%;
      background-color: #000000;
      width: 4px;
      height: 4px;
      display: inline-block;
      border: 1px sold #000000;
      top: 1rem;
      left: -0.8rem;
    }
  }
}
.zebra {
  li {
    border-bottom: 1px solid #DDDDDD;
  }
  li:first-child {
    border-top: 1px solid #DDDDDD;
  }
  li:nth-child(odd) {
    background-color: #f6f8f7;
  }
}
.card {
  li {
    background-color: #f6f8f7;
    border: 2px solid #DDDDDD;
    border-radius: 4px;
    margin-bottom: 5px;
  }
    li:last-child {
    margin-bottom: 0;
  }
  li:hover {
    border-color: #40a9ff;
  }
  li a:hover {
    text-decoration: none !important;
  }
}
</style>