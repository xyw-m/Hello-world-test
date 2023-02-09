<template>
  <div>just a test</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

function delay(message: string) {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      console.log('delay run');
      resolve({ data: 'waht' });
    }, 1000);
  });
}
const resData = {} as { [key: string]: { resData: any; isReq: boolean } };
const reqFunc: { [key: string]: any[] } = {};

function cacheReq(key: string, fn: any) {
  if (!resData[key]) {
    resData[key] = { resData: null, isReq: false };
  }
  if (resData[key].resData) {
    return resData[key].resData;
  } else {
    return new Promise((resolve) => {
      if (!reqFunc[key]) {
        reqFunc[key] = [];
      }
      reqFunc[key].push(resolve);
      if (resData[key].isReq) {
        //
      } else {
        resData[key].isReq = true;
        fn().then((res_: any) => {
          console.log(res_, 'res_');
          resData[key].resData = res_.data;
          reqFunc[key].forEach((item) => {
            item(resData[key].resData);
          });
        });
      }
    });
  }
}
@Component({
  name: 'temp',
})
export default class temp extends Vue {
  @Prop() message!: string;

  localMessage: any = '';

  created() {
    cacheReq('kkViewUrl', delay);
  }

  getResData() {
    console.log(resData, 'resData');
  }
}
</script>
