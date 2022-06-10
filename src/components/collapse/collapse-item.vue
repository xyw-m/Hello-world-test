<template>
  <div class="collapse-item">
    <!-- 标题 -->
    <div role="tab">
      <div 
        role="button"
        class="collapse-item-header">
        <slot name="title"> {{ title }}</slot>
        <i 
          class="collapse-item-arrow el-icon-arrow-down"
          :class="{'is-active': isActive}"></i>
      </div>
    </div>
    <!-- 内容 -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'collapseItem',
  components: {}
})
export default class collapseItem extends Vue {

}
</script>