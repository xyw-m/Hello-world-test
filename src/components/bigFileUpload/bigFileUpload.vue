<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      action="none"
      :http-request="submitUpload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :auto-upload="false"
      multiple
      :limit="limit"
      :show-file-list="false"
      :on-exceed="exceedLimit"
      class="inputField"
      :disabled="disabled"
    >
      <el-button size="mini" slot="trigger" class="header" v-if="!disabled"
        >选择文件</el-button
      >
      <el-button
        size="mini"
        @click="uploadToServer"
        class="header"
        v-if="!disabled"
        >上传</el-button
      >
      <span v-if="!disabled" v-show="timeShow" class="header"
        >剩余时间：{{ reTime }} s</span
      >
      <ul class="file-list">
        <li v-for="file in fileList" :key="file.uid">
          <div class="fileName" :title="file.name">
            <span>
              <i class="el-icon-document"></i>
              {{ file.name }}
            </span>
          </div>
          <div>
            <el-progress
              :percentage="file.progress.percentage"
              :text-inside="true"
              :stroke-width="20"
              :color="file.progress.color"
              class="percentage"
            >
            </el-progress>
            <i class="el-icon-circle-check" v-if="iconShow(file, 'check')"></i>
            <i class="el-icon-loading" v-if="iconShow(file, 'loading')"></i>
            <i
              class="el-icon-circle-check"
              style="color: green"
              v-if="iconShow(file, 'finished')"
            ></i>
            <i
              class="el-icon-warning-outline"
              style="color: red"
              v-if="iconShow(file, 'warning')"
            ></i>
          </div>
          <div class="operation">
            <el-button
              v-if="!disabled"
              size="mini"
              circle
              icon="el-icon-video-pause"
              v-show="iconShow(file, 'pause')"
              @click="file.isBreak = true"
            ></el-button>
            <el-button
              v-if="!disabled"
              size="mini"
              circle
              icon="el-icon-video-play"
              v-show="iconShow(file, 'containue')"
              @click="reUpload(file.uid)"
            ></el-button>
            <el-button
              size="mini"
              circle
              icon="el-icon-download"
              v-show="iconShow(file, 'download')"
              @click="downloadFile(file.fileUploadId)"
            ></el-button>
            <el-button
              v-if="!disabled"
              size="mini"
              circle
              icon="el-icon-close"
              v-show="iconShow(file, 'close')"
              @click="deleteFile(file.uid)"
            ></el-button>
            <el-button
              v-if="!disabled"
              size="mini"
              circle
              icon="el-icon-refresh-left"
              v-show="iconShow(file, 'reupload')"
              @click="reUpload(file.uid)"
            ></el-button>
          </div>
        </li>
      </ul>
    </el-upload>
  </div>
</template>
<script>
import MD5 from 'md5.js';
import {
  isExist,
  bigFileUpload,
  removeBigFileByMd5,
  fileDownload,
} from './api';

const SLICE_SIZE = 10485760; // 10M 单位为字节  后端要求切片不得小于5M

export default {
  data() {
    return {
      fileList: [],
      timeShow: false,
      reTime: 0,
    };
  },
  props: {
    sliceSize: Number,
    limit: {
      type: Number,
      default: 3,
    },
    // 用于反显
    fileLists: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    billType: {
      type: String,
      required: true,
    },
  },
  watch: {
    fileList: {
      deep: true,
      handler() {
        this.$forceUpdate();
      },
    },
    // 只用于反显
    fileLists: {
      deep: true,
      immediate: true,
      handler(arr) {
        if (arr && arr.length != 0) {
          arr.forEach((ele) => {
            const item = {
              name: ele.fileName,
              uid: ele.fileUploadInfoId,
              fileUploadId: ele.fileUploadInfoId,
              progress: {
                percentage: 100,
                color: '#409eff',
              },
              uploadStatus: 'success',
            };
            // 防止重复添加
            const flag = this.fileList.some((_ele) => _ele.uid == item.uid);
            if (!flag) {
              this.fileList.push(item);
              setTimeout(() => {
                this.$refs.upload.uploadFiles.push(item);
              });
            }
          });
        }
      },
    },
  },
  methods: {
    async beforeUpload(file) {
      const md5 = await this.getMd5(file);
      // md5传给后端判断是否已上传
      const res = await isExist({ md5 });
      const ele = this.fileList.find((_ele) => _ele.uid == file.uid);
      if (ele) {
        ele.md5 = md5;
        ele.uploadStatus = 'ready';
        ele.time = 0;
        ele.exist = res.data.exist;
        ele.isBreak = false;
        if (res.fileUploadId) {
          ele.fileUploadId = res.data.fileUploadId;
          ele.uploadStatus = 'success';
        } else {
          ele.nextChunk = res.data.nextChunk;
        }
      }
      return true;
    },

    async submitUpload(options) {
      // 在filelist中找到当前文件
      const currFile = this.fileList.find((ele) => ele.uid == options.file.uid);

      // 判断当前文件是否上传
      if (currFile.exist) {
        currFile.uploadStatus = 'success';
        currFile.progress.percentage = 100;
        return;
      }

      const file = currFile.raw;
      const sliceSize = this.sliceSize || SLICE_SIZE;
      const sliceCount = Math.ceil(file.size / sliceSize);
      const chunks = [];

      // 文件切片
      for (let i = 0; i < sliceCount; i++) {
        const start = i * sliceSize;
        let end = start + sliceSize;
        if (end > file.size) {
          end = file.size;
        }
        const slicedBlob = file.slice(start, end, file.type);
        chunks.push(slicedBlob);
      }

      // 从第几个切片开始传
      const truncation = currFile.nextChunk;

      // 更新视图
      this.timeShow = true;
      currFile.progress.percentage = 0;
      currFile.progress.color = '#409eff';
      currFile.uploadStatus = 'uploading';
      currFile.time = 0;

      // 串行Promise
      const uploadRes = await chunks.reduce(
        async (previourPromise, chunk, currentIndex) => {
          const info = await previourPromise;
          return new Promise((resolve) => {
            if (info.status == 'fail' || currFile.isBreak) {
              if (currFile.isBreak) info.status = 'fail';
              resolve(info);
              return;
            }
            if (currentIndex < truncation) {
              currFile.time = Math.ceil(
                (1 - (currentIndex + 1) / sliceCount) * 50
              );
              currFile.progress.percentage = Math.ceil(
                ((currentIndex + 1) / sliceCount) * 100
              );
              const _info = {
                status: 'success',
                currentIndex,
              };
              resolve(_info);
              return;
            }

            // 准备文件
            const formData = new FormData();
            formData.append('file', chunk, currFile.name);
            formData.append('fileName', currFile.name);
            formData.append('fileSize', currFile.size);
            formData.append('md5', currFile.md5);
            formData.append('chunks', sliceCount);
            formData.append('chunk', currentIndex);
            formData.append('billType', this.billType);

            bigFileUpload(formData)
              .then((res) => {
                currFile.time = res.data.restTime;
                currFile.progress.percentage = Math.ceil(
                  ((currentIndex + 1) / sliceCount) * 100
                );
                // 更新剩余时间
                let time = 0;
                this.fileList.forEach((_ele) => {
                  if (_ele.time) {
                    time += parseFloat(_ele.time);
                  }
                });
                this.reTime = Math.ceil(time);
                if (res.data.fileUploadId) {
                  currFile.fileUploadId = res.data.fileUploadId;
                }
                // 更新视图
                this.$forceUpdate();
                resolve({ status: 'success' });
              })
              .catch(() => {
                resolve({ status: 'fail' });
              });
          });
        },
        Promise.resolve({ status: 'success' })
      );

      return new Promise((resolve, reject) => {
        currFile.uploadStatus = 'success';
        if (uploadRes.status == 'success') {
          resolve(uploadRes);
        } else {
          if (currFile.isBreak) {
            currFile.uploadStatus = 'break';
          } else {
            currFile.uploadStatus = 'fail';
          }
          currFile.time = 0;
          currFile.progress.color = '#ff0000';
          this.reTime = 0;
          reject(new Error('上传失败'));
        }
      });
    },

    uploadToServer() {
      this.$refs.upload.submit();
    },

    handleChange(file) {
      const _isExist = this.fileList.some((ele) => ele.uid == file.uid);
      if (!_isExist) {
        file.uploadStatus = 'ready';
        file.progress = {
          percentage: 0,
          color: '#409eff',
        };
        this.fileList.push(file);
      }
    },

    reUpload(uid) {
      const ele = this.fileList.find((_ele) => _ele.uid == uid);
      ele.status = 'ready';
      ele.isBreak = false;
      ele.uploadStatus = 'uploading';
      this.$refs.upload.uploadFiles.push(ele);
      this.uploadToServer();
    },

    async deleteFile(uid) {
      // 文件尚未上传或已上传成功
      const ele = this.fileList.find((_ele) => _ele.uid == uid);
      if (ele.uploadStatus != 'ready' && ele.uploadStatus != 'success') {
        await removeBigFileByMd5({ md5: ele.md5 });
      }
      // 在fileList中删除文件
      const index = this.fileList.findIndex((_ele) => _ele.uid == uid);
      this.fileList.splice(index, 1);
      // 在el-upload中删除文件
      const elIndex = this.$refs.upload.uploadFiles.findIndex(
        (_ele) => _ele.uid == uid
      );
      this.$refs.upload.uploadFiles.splice(elIndex, 1);
    },

    async downloadFile(fileUploadId) {
      // if (fileUploadId) {
      //   const param = {
      //     fileUploadInfoId: fileUploadId,
      //     'security-token': sessionStorage.getItem('token').substring(7)
      //   }
      //   const res = await fileDownload(param)
      //   const type = res.headers['content-type']
      //   const blob = new Blob([res.data], { type: type })
      //   const url = window.URL.createObjectURL(blob)
      //   window.open(url)
      // }
      console.log('file download!');
    },

    exceedLimit() {
      this.$message(`最多允许${this.limit}个文件上传！`);
    },

    async getMd5(file) {
      let md5 = '';
      await file.text().then((text) => {
        md5 = new MD5().update(text).digest('hex');
      });
      return md5;
    },

    iconShow(file, icon) {
      let isShow = false;
      switch (file.uploadStatus) {
        case 'ready':
          isShow = icon == 'check' || icon == 'close';
          break;
        case 'uploading':
          isShow = icon == 'loading' || icon == 'pause';
          break;
        case 'break':
          isShow = icon == 'containue' || icon == 'close' || icon == 'warning';
          break;
        case 'success':
          isShow = icon == 'finished' || icon == 'download' || icon == 'close';
          break;
        case 'fail':
          isShow = icon == 'close' || icon == 'reupload' || icon == 'warning';
          break;
      }
      return isShow;
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-container {
  width: 100%;
  max-width: 400px;
  min-width: 280px;
  .inputField {
    // text-align: center;
    .header {
      margin-right: 10px;
      font-size: 12px;
      color: #606266;
    }
  }
  .percentage {
    display: inline-block;
    max-width: 150px;
    min-width: 80px;
    margin-left: 10px;
    margin-right: 2px;
  }
  .file-list {
    background-color: #ffffff;
    li {
      display: flex;
      margin-top: 5px;
      justify-content: space-between;
      line-height: 20px;
      .fileName {
        color: #606266;
        margin-left: 5px;
        text-align: left;
        flex-grow: 0;
        width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .operation {
    flex-grow: 1;
    margin-top: -3px;
    transform: scale(0.7);
    i.allowOperate {
      margin-right: 2px;
      cursor: pointer;
    }
    button {
      margin-left: 5px;
    }
  }
}
</style>
