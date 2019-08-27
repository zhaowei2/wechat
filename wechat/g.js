
// 加密
const sha1 = require('sha1');
const getRqwBody = require('raw-body')
const Wechat = require('./wechat')
const util = require('./util')
module.exports = function(opts){
  
  let wechat = new Wechat(opts)
  return function *(next){
    let that =this;
    let token = opts.token;
    let signature = this.query.signature;
    let nonce = this.query.nonce;
    let timestamp = this.query.timestamp;
    let echostr = this.query.echostr;
    let str = [token,timestamp,nonce].sort().join('')
    let sha = sha1(str);
    if(this.method==="GET"){
      if(sha===signature){//验证消息的确来自微信服务器
        this.body= echostr + '';
      }else{
        this.body = 'wrong'
      }
    }else if(this.method==="POST"){
      if(sha!==signature){//验证消息的确来自微信服务器
        this.body= 'wrong'
        return false;
      }else{
        var data = yield getRqwBody(this.req,{
          length:this.length,
          limit:'1mb',
          encoding:this.charset
        })
        console.log(data)
        console.log(data.toString())

        let content = yield util.parseXMLAsync(data)
        console.log(content)
        let message = util.formatMessage(content.xml)
        console.log(message)
        // 
        var now = new Date().getTime()
        if(message.MsgType ==='event'){
          if(message.Event ==='subscribe'){
            that.status =200
            that.type="application/xml"
            that.body='<xml>'+
              '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
              '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
              '<CreateTime>'+now+'</CreateTime>'+
              '<MsgType><![CDATA[text]]></MsgType>'+
              '<Content><![CDATA[你好]]></Content>'+
            '</xml>'
            return 
          }
        }else if(message.MsgType ==='text'){
            that.status =200
            that.type="application/xml"
            that.body='<xml>'+
              '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
              '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
              '<CreateTime>'+now+'</CreateTime>'+
              '<MsgType><![CDATA[text]]></MsgType>'+
              '<Content><![CDATA[hello word]]></Content>'+
            '</xml>'
            return 
        }else if(message.MsgType ==='image'){
          that.status =200
          that.type="application/xml"
          that.body='<xml>'+
            '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
            '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
            '<CreateTime>'+now+'</CreateTime>'+
            '<MsgType><![CDATA[image]]></MsgType>'+
            '<Image>'+
              '<MediaId><![CDATA['+message.MediaId+']]></MediaId>'+
            '</Image>'+
          '</xml>';
          return 
        }
        // 
      }
    }
  }
}
