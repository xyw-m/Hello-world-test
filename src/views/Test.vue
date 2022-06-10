<template>
    <div class="about">
        <grid-layout
            :layout.sync="layout"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"></grid-layout>
    </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
export default {
    // components: {
    //     GridLayout: VueGridLayout.GridLayout,
    //     GridItem: VueGridLayout.GridItem
    // }
}
</script>