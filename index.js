// const config= require('./config/config')
// const Wechat = require('./wechat/wechat') 

var express = require('express')
var app = express()
app.set('views', './view')
app.set('view engine', 'pug')

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
app.listen(3000, () => console.log('Example app listening on port 3000!'))

// let wechat =new Wechat(config)