import { initGlobalState, MicroAppStateActions } from 'qiankun'

// 在主应用中
const initialState = {
  component:{
    path: '',
    com: null
  }
}

// 初始化state
const actions = initGlobalState(initialState)

// 监听actions全局公共状态数据的变化
// actions.onGlobalStateChange((state, prevState) => {
//   console.log(`主应用变更前： ${prevState}`)
//   console.log(prevState)
//   console.log(`主应用变更后： ${state}`)
//   console.log(state)
// })

export default actions