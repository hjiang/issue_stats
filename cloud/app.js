/* global AV */

'use strict';

require('date-utils');

var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

var GlobalCount = AV.Object.extend('GlobalCount');

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.post('/issue_webhook', function(req, res) {
  console.dir(req.body);
  var action = req.body.action;
  if (!req.body.hasOwnProperty('action')) {
    res.status(400).end();
  } else {
    if (action === 'opened' || action === 'closed') {
      var date = Date.today();
      var query = new AV.Query(GlobalCount);
      query.equalTo('date', date);
      query.equalTo('action', action);
      query.first({
        success: function(gcount) {
          gcount.increment('count');
          gcount.save();
        },
        error: function(error) {
          var gcount = new GlobalCount();
          gcount.set('action', action);
          gcount.set('count', 0);
          gcount.save();
        }   
      });
      res.status(200).end();
    }
  }
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
