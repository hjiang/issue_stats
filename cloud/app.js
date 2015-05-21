/* global AV */

'use strict';

require('date-utils');

var express = require('express');
var app = express();

app.set('views','cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());

var GlobalCount = AV.Object.extend('GlobalCount');

app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.post('/issue_webhook', function(req, res) {
  if (!req.body.hasOwnProperty('action')) {
    console.log('request has no action');
    res.status(200).end();
  } else {
    var action = req.body.action;
    console.log('action:', action);
    var date = new Date().setHours(0, 0, 0, 0);
    var query = new AV.Query(GlobalCount);
    query.equalTo('date', date);
    query.equalTo('action', action);
    query.first({
      success: function (gcount) {
        if (!gcount) {
          gcount = new GlobalCount();
          gcount.set('action', action);
          gcount.set('date', date);
          gcount.set('count', 1);
        } else {
          gcount.increment('count');
        }
        gcount.save();
      },
      error: function (error) {
        var gcount = new GlobalCount();
        gcount.set('action', action);
        gcount.set('date', date);
        gcount.set('count', 1);
        gcount.save();
      }
    });
    res.status(200).end();
  }
});

app.listen();
