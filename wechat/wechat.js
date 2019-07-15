'use strict'
const request = require('request');
const util =require('./../util');
const config = {
  tokenFileName:'./config/token.txt'
}

// 微信请求地址
const prefix = 'https://api.weixin.qq.com/cgi-bin/'

function Wechat(opts){
  this.appID =opts.appID
  this.appSecret = opts.appSecret
  this.expires_in = 0;
  this.initAccessToken()
}
// 初始化获取token
Wechat.prototype.initAccessToken =function(){
  console.log('初始化token')
  let _this=this
  this.getAccessToken()
      .then(function(data){
        console.log(data)
        if(_this.isValidAccessToken(data)){
          return data
        }else{
          return _this.updataAccessToken()
        }
      }).then(function(data){
        _this.saveAccessToken(data)
        // return data
      })
}
// 获取token
Wechat.prototype.getAccessToken = function(){
  console.log('获取token')
  let appID = this.appID
  let appSecret = this.appSecret
  let _this =this
  let url =prefix+'token?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret
  return new Promise(function(resolve,reject){
    request({
      url:url,
      json:true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('返回请求token')
        let nowTime =new Date().getTime()
        _this.expires_in =nowTime+(body.expires_in)*1000-2000
        resolve(body)
      }
    })
  })
}
// 验证票据是否合法
Wechat.prototype.isValidAccessToken =function(data){
  console.log('验证token是否合法')
  if(!data||!data.access_token||!data.expires_in){
    return false
  }
  let expires_in = data.expires_in
  let now = new Date().getTime()
  if(now > this.expires_in){
    return false
  }else{
    return true
  }
}
Wechat.prototype.updataAccessToken =function(){
  let appID = this.appID
  let appSecret = this.appSecret
  let url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret
  return new Promise(function (resolve, reject) {
    request({
      url:url,
      json:true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('返回请求token')
        console.log(body) // 请求成功的处理逻辑
        let now = new Date().getTime()
        let nowTime =new Date().getTime()
        _this.expires_in =nowTime+(body.expires_in)*1000-2000
        resolve(body)
      }
    })
  })
}
// 保存token
Wechat.prototype.saveAccessToken =function(data){
  console.log('保存token')
  console.log(config.tokenFileName)
  util.writeFileAsync(config.tokenFileName,data)
}
module.exports = Wechat