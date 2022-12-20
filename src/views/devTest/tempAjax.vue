<template>
  <div>测试Ajax函数
    <el-button @click="callAjax">发送ajax请求</el-button>
  </div>
</template>
<script>
import util from './api'
export default {
  methods: {
    async callAjax(){
      const res = await util.http('url', 'get', 'params', '1.2.3')
      console.log(res, 'res')
    }
  }
}
</script>