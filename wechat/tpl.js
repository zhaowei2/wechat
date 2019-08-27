exports = function(message,that){
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
    if(message.Event ==='subscribe'){
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
        '<MediaId><![CDATA[media_id]]></MediaId>'+
      '</Image>'+
    '</xml>';
  }
  }
}