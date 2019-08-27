'use strict'
var xml2js = require('xml2js');
exports.parseXMLAsync = function(xml){
  return new Promise((resolve,reject)=>{
    xml2js.parseString(xml,{trim:true},function(err,content){
      if(err) reject(err)
      else resolve(content)
    })
  })
}
function formatMessage(result){
  console.log(result)
  var message = {}
  if(typeof result ==='object'){
    var keys = Object.keys(result)
    console.log(keys)
    for(var i =0;i<keys.length;i++){
      var item = result[keys[i]];
      var key = keys[i];
      if(!(item instanceof Array) ||item.length === 0){
        continue
      }
      console.log(item)
      if(item.length===1){
        var val = item[0];
        console.log(val)
        if(typeof val === 'object'){
          message[key] = formatMessage(val)
        }else{
          message[key] =val
        }
      }else{
        message[key]=[]
        for(var j=0,k=item.length;j<k;j++){
          message[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return message
}
exports.formatMessage = formatMessage
