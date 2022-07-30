

// 查看当前上传文件状态
export function isExist(data:any) {
  return new Promise((resolve:any) => {
    setTimeout(() => {
      const isExist = Math.random() > 0.5
      const fileUploadId = Math.ceil((Math.random() * 10000000))
      if(isExist){
        resolve({
          isExist: isExist,
          fileUploadId: fileUploadId
        })
      } else {
        resolve({
          isExist: isExist,
          nextChunk: -1
        })
      }
    })
  })
}

// 大文件上传
export function bigFileUpload(data:any) {
  return new Promise((resolve:any) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

// 删除文件
export function removeBigFileByMd5(data:any) {
  return new Promise((resolve:any) => {
    setTimeout(() => {
      resolve()
    }, 100)
  })
}

// 上传文件下载
// export function fileDownload(data:any) {
//   return util.http({
//     method: 'GET',
//     url: env.VUE_APP_FILE + '/stdp/file/filesDownload',
//     responseType: 'blob',
//     params: data
//   })
// }
