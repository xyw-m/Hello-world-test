<template>
  <div>
    <el-button @click="open = true">open</el-button>
    <el-dialog :visible.sync="open" append-to-body>
      <el-tree
        :data="treeData"
        node-key="id"
        default-expand-all>
        <template v-slot="{node, data}">
          <div>
            <div v-if="data.level === 1" class="tableWrapper">
              <span>{{data.stage}}</span>
              <span>{{data.milestone}}</span>
              <span>{{data.description}}</span>
              <span>{{data.finishDate}}</span>
              <span>{{data.status}}</span>
              <span>{{data.evaluation}}</span>
              <span>{{data.progress}}</span>
              <a @click="append(data)" size="mini">新建节点</a> |
              <a @click="remove(node, data)" size="mini">删除里程碑</a>
            </div>
            <div v-if="data.level === 2" class="tableWrapper" @click="handleClick(node)">
              <span>{{data.name}}</span>
              <span>{{data.startTime}}</span>
              <span>{{data.endTime}}</span>
              <span>{{data.principal}}</span>
              <span>{{data.initiator}}</span>
              <span>{{data.status}}</span>
              <span>{{data.workTime}}</span>
              <span>{{data.file}}</span>
              <a @click="append(data)" size="mini">新建任务</a> | 
              <a @click="remove(node, data)" size="mini">删除节点</a>
            </div>
            <div v-if="data.level === 3" class="tableWrapper" >
              <span>{{data.taskName}}</span>
              <span>{{data.startTime}}</span>
              <span>{{data.endTime}}</span>
              <span>{{data.principal}}</span>
              <span>{{data.initiator}}</span>
              <span>{{data.status}}</span>
              <span>{{data.description}}</span>
              <span>{{data.workTime}}</span>
              <span>{{data.file}}</span>
              <a @click="remove(node, data)" size="mini">删除任务</a> 
            </div>
          </div>
        </template>
      </el-tree>
    </el-dialog>

  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { data } from './temp.js'
const secondData = {
  id: 1112,
  name: '需求调研',
  startTime: '2022-10-01',
  endTime: '2022-10-15',
  principal: '张三',
  initiator: 'XXX',
  status: '进行中',
  workTime: 'xxx',
  file: 'xxx',
  level: 2
}
const thirdData = {
  id: 2231,
  taskName: '完成方案初稿',
  startTime: '2022-10-16',
  endTime: '2022-10-20',
  principal: 'xxx',
  initiator: 'XXX',
  status: 'xxx',
  description: 'xxx',
  workTime: 'xx',
  file: '333',
  level: 3
}
@Component({
  name: 'updateLog'
})
export default class updateLog extends Vue {
  treeData = data
  open = false

  @Watch('treeData', {deep: true})
  onDataChange(){
    console.log(this.treeData, 'treeData')
  }

  append(localData:any){
    let newChild:any
    switch(localData.level){
      case 1:
        newChild = secondData
        break;
      case 2:
        newChild = thirdData 
        break;
    }
    newChild.id = new Date().getTime()
    if(!localData.children){
      this.$set(localData, 'children', [])
    }
    localData.children.push(newChild)
  }

  remove(node:any, data:any){
    console.log(node, 'node')
    const parent = node.parent
    const children = parent.data.children || parent.data
    const index = children.findIndex( (d:any) => d.id === data.id)
    children.splice(index, 1)
  }

  handleClick(node:any){
    console.log(node, 'node')
  }
}
</script>
<style lang="scss" scoped>
.tableWrapper {
  display: flex;
  justify-content: space-around;
  span {
    margin-right: 10px;
  }
}
</style>