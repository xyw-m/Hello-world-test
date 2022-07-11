<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { start } from 'qiankun'
@Component({
  name: 'qiankunTest'
})
export default class qiankunTest extends Vue {
  
  mounted(){
    if(!(window as any).qiankunStarted){
      (window as any).qiankunStarted = true
      start()
    }
  }
} 
</script>