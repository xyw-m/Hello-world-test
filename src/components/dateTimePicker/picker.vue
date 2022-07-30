<template>
  <el-input
    :value="displayValue"></el-input>
</template>
<script>
export default {
  data(){
    return {
      displayValue: ''
    }
  },
  mounted(){
    console.log(this, 'this.type')
  }
}
</script>