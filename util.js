'use strict'
const fs = require('fs')

exports.readFileAsync =function(fpath,encoding){
  console.log('读取token')
  return new Promise(function(resolve,reject){
    fs.readFile(fpath,encoding,function(err,content){
      if (err){ reject(err)
      }else{
        resolve(content)
      }
    })
  })
}
exports.writeFileAsync = function(fpath,content){
  // 写入token
  console.log('写入token')
  console.log(content)
  let data =JSON.stringify(content)
  return new Promise(function (resolve, reject) {
    fs.writeFile(fpath, data, function (err) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}