<template>
    <div class="side-container">
        <el-menu
            default-active="1"
            router>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>11111111</span>
                </template>
                <el-menu-item index="/communication">父子应用通信</el-menu-item>
                <el-menu-item index="/about">affix.md</el-menu-item>
                <el-menu-item index="/test">test.md</el-menu-item>
                <el-menu-item index="/playground">playground</el-menu-item>
                <el-menu-item index="/collapse">collapse</el-menu-item>
                <el-menu-item index="/xywui">xywui-test</el-menu-item>
                <el-menu-item index="/store-app">child-web</el-menu-item>
                <el-menu-item index="/zoom">zoom</el-menu-item>
                <el-menu-item index="/list">list</el-menu-item>
                <el-menu-item index="/datepicker">datepicker</el-menu-item>
                <el-menu-item index="/fileUpload">文件上传</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script lang="ts">
export default {
    name: 'Aside',
    data(){
        return {
            name: 'Aside',
            friends: ['one', 'two', 'three', 'four']
        }
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.side-container {
    position: fixed;
    width: 220px;
    height: 100vh;
    top: 0;
    left: 0;
}
</style>