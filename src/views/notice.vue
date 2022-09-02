<template>
  <div class="notice">
    <banner 
      v-for="(notice, index) in noticeList"
      :key="index"
      :multi-line="notice.multi"
      :show-detail="notice.detail"
      :type="notice.type">
      {{ notice.text}}
    </banner>
  </div> 
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import banner from '@/components/Notification/banner.vue'
const longText = 
  `CSS 颜色使用组合了红绿蓝颜色值 (RGB) 的十六进制 (hex) 表示法进行定义。
    对光源进行设置的最低值可以是 0（十六进制 00）。最高值是 255（十六进制 FF）。
   从 0 到 255 种红绿蓝值能够组合出总共超过一千六百万种不同的颜色（根据 256 x 256 x 256 计算）。`
const shortText = 'CSS 颜色使用组合了红绿蓝颜色值 (RGB) 的十六进制 (hex) 表示法进行定义.'
@Component({
  name: 'Notice',
  components: { banner }
})
export default class Notice extends Vue {

  noticeList = [
    { text: longText, multi: false, detail: false, type: 'success' },
    { text: longText, multi: false, detail: true, type: 'info' },
    { text: longText, multi: false, detail: true, type: 'warning' },
    { text: longText, multi: false, detail: true, type: 'error' },
    { text: shortText, multi: false, detail: false, type: 'success' },
    { text: shortText, multi: false, detail: true, type: 'info' },
    { text: shortText, multi: false, detail: true, type: 'warning' },
    { text: shortText, multi: false, detail: true, type: 'error' },
    { text: longText, multi: true, detail: false, type: 'success' },
    { text: longText, multi: true, detail: true, type: 'info' },
    { text: longText, multi: true, detail: true, type: 'warning' },
    { text: longText, multi: true, detail: true, type: 'error' },
  ]

}
</script>
<style lang="scss" scoped>
</style>