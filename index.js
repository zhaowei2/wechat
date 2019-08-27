// koa 框架
const Koa = require('koa');

const wechat = require('./wechat/g')
const config = {
  wechat:{
    appID: 'wxd38096734e06c571',
    appSecret: 'd49c1d075ab9fc0b7c197fbb93d31018',
    token: 'zhaowei123'
  }
}
const convert = require('koa-convert');
const app = new Koa()

app.use(convert(wechat(config.wechat)))
app.listen(3000)
console.log('linsting 3000')
