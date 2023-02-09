<template>
  <div>
    <big-file-upload billType="custom" :sliceSize="204800"></big-file-upload>
    <!-- <el-button @click="click">Promise串行</el-button>
    <el-button @click="clickAsync">Async串行</el-button> -->
  </div>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator';
import bigFileUpload from '@/components/bigFileUpload/bigFileUpload.vue';
import md5 from 'md5';
import MD5 from 'md5.js';

const SLICE_SIZE = 20480;

@Component({
  name: 'fileUpload',
  components: { bigFileUpload },
})
export default class fileUpload extends Vue {
  file = null;

  mounted() {
    window.md5 = md5;
    window.MD5 = MD5;
  }

  async click() {
    // 串行Promise
    const userIds = [1, 2, 3];
    const res = userIds.reduce((accumulatorPromise, nextId) => {
      console.log(`Loop ${new Date()}`);
      return accumulatorPromise.then((isStop) => {
        console.log(isStop, 'isStop是哪里来的参数？');
        return new Promise((resolve) => {
          if (isStop == '上传失败') {
            resolve(isStop);
            return;
          }
          setTimeout(() => {
            console.log(`currentIndex: ${nextId} Resolve ${new Date()}`);
            const flag = Math.random() > 0.5 ? '上传成功' : '上传失败';
            console.log(`本次上传的结果是：${flag}`);
            if (flag == '上传成功') {
              resolve(nextId);
            } else {
              resolve(flag);
            }
          }, 1000);
        });
      });
    }, Promise.resolve());
    res.then((res1) => {
      console.log(res1, '串行完毕 结局');
    });
  }

  async clickAsync() {
    const userIds = [1, 2, 3];
    const uploadRes = await userIds.reduce(async (previourPromise, nextId) => {
      const isStop = await previourPromise;
      return new Promise((resolve) => {
        if (isStop == '上传失败') {
          resolve(isStop);
          return;
        }
        setTimeout(() => {
          console.log(`currentIndex: ${nextId} Resolve ${new Date()}`);
          const flag = Math.random() > 0.5 ? '上传成功' : '上传失败';
          if (flag == '上传成功') {
            resolve(nextId);
          } else {
            resolve(flag);
          }
        });
      });
    }, Promise.resolve());
    console.log(`最终结果：${uploadRes}`);
  }

  handleChange() {
    const input = document.querySelector('#file');
    this.file = input.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      // console.log(e.target.result)
      // console.log(md5(e.target.result), 'md5')
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  submit() {
    const sliceCount = Math.ceil(this.file.size / SLICE_SIZE);
    const chunks = [];
    for (let i = 0; i < sliceCount; i++) {
      const start = i * SLICE_SIZE;
      let end = start + SLICE_SIZE;
      if (end > this.file.size) {
        end = this.file.size;
      }
      const slicedBlob = this.file.slice(start, end);
      chunks.push(slicedBlob);
      // slicedBlob.text().then(text => {
      // })
    }
    this.file.text().then((text) => {
      console.log(md5(text), 'md5');
      console.log(new MD5().update(text).digest('hex'), 'md5.js');
    });
  }
}
</script>
