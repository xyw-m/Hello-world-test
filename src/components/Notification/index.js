import Vue from 'vue'
import Main from './notification.vue'
import merge from 'element-ui/src/utils/merge'
import { PopupManager } from 'element-ui/src/utils/popup'


const NotificationConstructor = Vue.extend(Main)

let instance
let instances = []
let seed = 1

const Notification = function(options){
  options = merge({}, options)
  const userOnClose = options.onClose
  const id = 'sinotruk-notification_' + seed++
  const position = options.position || 'top-right'

  options.onClose = function(){
    Notification.close(id, userOnClose)
  }


  instance = new NotificationConstructor({
    data: options
  })

  instance.id = id
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
  instance.dom = instance.$el
  instance.dom.style.zIndex = PopupManager.nextZIndex()

  let verticalOffset = options.offset || 0
  instances.filter(item => item.position === position).forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.verticalOffset = verticalOffset
  instances.push(instance)
  return instance
}

Notification.close = function(id, userOnClose){
  let index = -1
  const len = instances.length
  const instance = instances.filter((instance, i) => {
    if(instance.id === id){
      index = i
      return true
    }
    return false
  })[0]

  if(!instance) return

  if(typeof userOnClose === 'function'){
    userOnClose(instance)
  }
  instances.splice(index, 1)

  if(len <= 1) return

  const position = instance.position
  const removedHeight = instance.dom.offsetHeight
  for(let i = index; i < len - 1; i++){
    if(instances[i].position === position){
      instances[i].dom.style[instance.verticalProperty] = 
        parseInt(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px'
    }
  }
}

Notification.closeAll = function(){
  for(let i = instance.length - 1; i >= 0; i--){
    instances[i].close()
  }
}


// const nofifyInstall = {
//   install: () => {
//     Vue.prototype.$customNofity = Notification
//   }
// }

// export default nofifyInstall
export default Notification