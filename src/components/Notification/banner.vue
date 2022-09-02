<template>
  <div class="container">
    <el-alert
      :type="type"
      :class="type"
      :closable="type === 'info'"
      class="common">
      <div class="wrapper">
        <i :class="iconClass"></i>
        <div class="text-wrapper">
          <div class="text"  :id="id">
            <span 
              :class="{ animation: animate, multiLine: multiLine, showDetail: showDetail }"
              @click="handleClick">
              <slot></slot>
            </span>
          </div>
        </div>
      </div>
    </el-alert>
  </div>
</template>
<script>
export default {
  data(){
    return {
      id:  'id' + Math.floor((1+Math.random()) * new Date().getTime()),
      animate: false
    }
  },

  props: {
    type: {
      type: String,
      default: 'info'
    },
    multiLine: {
      type: Boolean,
      default: false
    },
    showDetail: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClick(){
      if(!this.showDetail) return 
      this.$emit('click')
    }
  },

  computed: {
    iconClass(){
      let iconClass = ''
      switch(this.type){
        case 'info':
          iconClass = 'el-icon-message-solid'
          break;
        case 'success':
          iconClass = 'el-icon-success'
          break;
        case 'warning':
          iconClass = "el-icon-warning"
          break;
        case 'error': 
          iconClass = "el-icon-warning"
          break;
      }
      return iconClass
    }
  },

  mounted(){
    this.$nextTick(() => {
      const text = document.querySelector(`#${this.id}`)
      const textNode = document.querySelector(`#${this.id} span`)
      this.animate = textNode.clientWidth > text.clientWidth
    })
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  margin: 10px 0;

  .common {
    border-radius: 4px;
    color: #222222;
    padding: 6px 8px 6px 6px;
    .showDetail {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .info {
    border: 1px solid #0A8CFF;
    background-color: #E6F1FF;
    .showDetail {
      &:hover {
        // text-decoration: underline;
        color: #0A8CFF;
        // cursor: pointer;
      }
    }
  }

  .success {
    border: 1px solid #09B66D;
    background-color: #E6F7F0;
    .showDetail {
      &:hover {
        color: #09B66D;
      }
    }
  }

  .warning {
    border: 1px solid #F7B500;
    background-color: #FEF7E5;
    .showDetail {
      &:hover {
        color: #F7B500;
      }
    }
  }

  .error {
    border: 1px solid #FF3D57;
    background-color: #FAE9E9;
    .showDetail {
      &:hover {
        color: #FF3D57;
      }
    }
  }

  .wrapper {
    display: flex;
    line-height: 26px;
    i {
      line-height: 26px;
    }

    .text-wrapper {
      overflow: hidden;
      margin-left: 11px;
      .text {
        span {
          display: inline-block;
          white-space: nowrap;
        }

        .multiLine {
          white-space: normal;
          text-align: left;
        }
      }
    }

    .animation {
      animation: 30s wordsLoop linear infinite normal;
    }

    @keyframes wordsLoop {
      0% {
        transform: translateX(200px);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  }

  ::v-deep .el-alert__content {
    width: 100%;
  }

  ::v-deep .el-alert__description {
    margin: 0;
    color:#222222;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
  }

  ::v-deep .info .el-alert__description {
    padding-right: 34px;
  }
}
</style>
