'use strict'
const request = require('request');
const util =require('./../util');
const config = {
  tokenFileName:'./config/token.txt'
}

// 微信请求地址
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const upload = 'https://api.weixin.qq.com/cgi-bin/media/upload'

function Wechat(opts){
  this.appID =opts.appID
  this.token =opts.token
  this.appSecret = opts.appSecret
  this.expires_in = 0;
  this.accessToken={}
  this.initAccessToken()
  // this.fetchAccessToken()
}
// 初始化获取token
Wechat.prototype.initAccessToken =function(){
  console.log('初始化token')
  let _this = this
  util.readFileAsync(config.tokenFileName,'utf-8').then(function(data){
    console.log('readFile ')
    let _data =JSON.parse(data)
    if(_this.isValidAccessToken(_data)){
      console.log('isValidAccessToken')
      _this.accessToken = data
      return _data
    }else{
      console.log('updataAccessToken')
      return _this.updataAccessToken()
    }
  }).catch(function(){
    console.log('catch updataAccessToken')
      return _this.updataAccessToken()
  }).then(data=>{
    // 保存token
    _this.accessToken = data
    _this.expires_in =data.expires_in
    this.saveAccessToken(data)  
  })
}
// 获取token
Wechat.prototype.getAccessToken = function(){
  console.log('获取token')
  let appID = this.appID
  let appSecret = this.appSecret
  let token = this.tken
  let _this =this
  let url = prefix+'token='+token+'?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret
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
  if(now > data.expires_in){
    console.log('无效')
    return false
  }else{
    console.log('合法')
    return true
  }
}
Wechat.prototype.updataAccessToken =function(){
  let _this = this
  let appID = this.appID
  let appSecret = this.appSecret
  let url = prefix + 'token?grant_type=client_credential&appid=' + appID + '&secret=' + appSecret
  console.log(url)
  return new Promise(function (resolve, reject) {
    request({
      url:url,
      json:true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('返回请求token')
        // 请求成功的处理逻辑
        let nowTime =new Date().getTime()
        _this.expires_in = nowTime+(body.expires_in)*1000-2000
        
        resolve(body)
      }
    })
  })
}
// 保存token
Wechat.prototype.saveAccessToken =function(data){
  console.log('保存token')
  let obj = {
    access_token:data.access_token,
    expires_in:this.expires_in
  }
  // let str = JSON.stringify(obj)
  util.writeFileAsync(config.tokenFileName,obj)
}
// 获得票据access_token
Wechat.prototype.fetchAccessToken = function () {
  var that = this
  return this.getAccessToken().then(function (data) {
      try {
          data = JSON.parse(data)
      } catch (e) {
          return that.updataAccessToken()
      }
      if (that.isValidAccessToken(data)) {
          return Promise.resolve(data)
      } else {
          return that.updataAccessToken()
      }
  }).then(function (data) {
      // that.access_token = data.access_token
      // that.expires_in = data.expires_in
      that.saveAccessToken(data)
      return Promise.resolve(data)
  })
}
Wechat.prototype.uploadMaterial = function(){
  var form={
    mdeia:fs.createReadStream(filepath)
  };
  let that = this
  return new Promise((resolve,reject)=>{
    that.initAccessToken.then(data=>{
      var url =upload+'&access_token'+data.access_token+'&type'+type
      request({
        method:'POST',
        url:url,
        formDta:form,
        json:true
      }).then(function(res){
        var _data = response[1]
        if(_data){
          resolve(data)
        }else{
        resolve(data)
          throw new Error('upload')
        }
      }).catch(res=>{
        throw new Error('upload')
      })
    })
  })
  let appID = this.appID
  let appSecret = this.appSecret
  let url = upload+'?access_token='+api.accessToken + '&appid=' + appID + '&secret=' + appSecret
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
module.exports = Wechat