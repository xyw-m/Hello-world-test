import axios from "axios";

const util = {}

util.http = async function(url, method, params, backEndVer = ''){
  let isStop = false
  if(backEndVer){
    console.log('查询后端版本号是否满足需求')
    const version = await util.http('/queryBackEndVersion', 'get')
    // 大于0.5 满足需求
    isStop = version < 0.5
    console.log(`满足否？${!isStop}`)
  }

  if(isStop){
    console.log('请升级后端版本号！')
    return ''
  }
  
  const res = await new Promise((resolve) => {
    console.log('真正的promise')
    resolve(Math.random() > 0.5)
  })
  return res
}

export default util