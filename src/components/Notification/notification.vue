<template>
  <transition name="notification-fade">
    <div
      :class="['notification', customClass, horizontalClass]"
      v-show="visible"
      :style="positionStyle"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click">
      <i class="notification-icon" :class="[iconClass]"></i>
      <div class="notification-group">
        <h2 class="title">{{ title }}</h2>
        <div class="content" v-show="message">
          <slot>
            {{ message }}
          </slot>
        </div>
        <div class="notification-closeBtn el-icon-close" v-if="showClose" @click.stop="close"></div>
        <div class="notification-footer" v-if="showBtn">
          <el-button size="mini" class="later" @click="handleLater">稍后提醒</el-button>
          <el-button size="mini" type="primary" @click="handleTodo">{{ btnText }}</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data(){
    return {
      visible: false,
      title: '',
      message: '',
      duration: 5000,
      showClose: true,
      customClass: '',
      iconClass: 'el-icon-bell',
      onClose: null,
      onClick: null,
      closed: false,
      verticalOffset: 0,
      timer: null,
      position: 'top-right',
      btnText: '主行动点',
      showBtn: true,
      onLater: null,
      onTodo: null
    }
  },

  computed: {
    horizontalClass(){
      return this.position.indexOf('right') > -1 ? 'right' : 'left'
    },
    verticalProperty(){
      return /^top-/.test(this.position) ? 'top' : 'bottom'
    },
    positionStyle(){
      return {
        [this.verticalProperty]: `${this.verticalOffset}px`
      }
    }
  },

  watch: {
    closed(newVal){
      if(newVal){
        this.visible = false
        this.$el.addEventListener('transitionend', this.destroyElement)
      }
    }
  },

  methods: {
    destroyElement(){
      this.$el.removeEventListener('transitionend', this.destroyElement)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    click(){
      if(typeof this.onClick === 'function'){
        this.onClick()
      }
    },
    close(){
      this.closed = true
      if(typeof this.onClose === 'function'){
        this.onClose()
      }
    },
    clearTimer(){
      clearTimeout(this.timer)
    },
    startTimer(){
      if(this.duration > 0){
        this.timer = setTimeout(() => {
          if(!this.closed){
            this.close()
          }
        }, this.duration)
      }
    },
    handleLater(){
      if(typeof this.onLater !== 'function') return
      this.close()
      this.onLater()
    },
    handleTodo(){
      if(typeof this.onTodo !== 'function') return
      this.onTodo()
    }
  },

  mounted(){
    if(this.duration > 0){
      this.timer = setTimeout(() => {
        if(!this.closed){
          this.close()
        }
      }, this.duration)
    }
  }
}
</script>
<style lang="scss" scoped>
.notification {
  width: 450px;
  background-color: #FFFFFF;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  position: fixed;
  display: flex;
  padding: 10px 20px;
  transition: opacity .5s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;

  .notification-icon {
    font-size: 16px;
    color: #0A7CFF;
    margin-right: 5px;
    line-height: 26px;
  }

  .notification-group {
    .title {
      font-size: 14px;
      color: #0A7CFF;
      font-weight: bold;
      text-align: left;
      line-height: 26px;
      margin-bottom: 7px;
    }

    .content {
      font-size: 12px;
      color: #222222;
      line-height: 20px;
      text-align: left;
    }

    .notification-closeBtn {
      position: absolute;
      font-size: 20px;
      color: #909399;
      top: 10px;
      left: 420px;
      cursor: pointer;
    }
  }

  .notification-footer {
    text-align: right;
    font-size: 12px;
    margin-top: 10px;

    button {
      background-color: #0A7CFF;
    }

    .later {
      border: 1px solid #0A7CFF;
      background-color: #FFFFFF;
      border-radius: 2px;
      color: #0A7CFF;
    }
  }
}

.notification-fade-enter {
  &.right {
    right: 0;
    transform: translateX(100%);
  }
}

.notification-fade-enter-active {
  &.right {
    right: 0;
    transform: translateX(100%);
  }

  &.left {
    left: 0;
    transform: translateX(-100%);
  }
}

.notification-fade-leave-active {
  opacity: 0;
}

.right {
  right: 16px;
}

.left {
  left: 16px;
}
</style>