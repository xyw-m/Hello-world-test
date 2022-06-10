<template>
    <el-container>
        <Aside/>
        <AppMain />
    </el-container>
</template>
<script lang="ts">
import Vue from 'vue'
import Aside from './component/Aside.vue'
import AppMain from './component/AppMain.vue'
import axios from 'axios'
export default Vue.extend({
    components: {Aside, AppMain}
})
</script>
<style lang="scss" scoped>
</style>