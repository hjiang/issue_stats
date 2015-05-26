/* global AV */

'use strict';

var moment = require('moment');
var _ = require('underscore');

var express = require('express');
var app = express();

app.set('views','cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());

var GlobalCount = AV.Object.extend('GlobalCount');

app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

function processForChart(results) {
  var next = 'closed',
      dates = [],
      opens = [],
      closes = [];
  
  _.each(results, function(result){
      var date = moment(result.get('date')).format('YYYY-MM-DD');
      var action = result.get('action');
      var count = result.get('count');
      if (next !== action) {
        if (next === 'opened') {
          opens.push(0);
        } else {
          closes.push(0);
        }
      }
      console.log('----');
      if (_.isEmpty(dates) || _.last(dates) !== date) {
        console.log('pushing date');
        dates.push(date);
      }
      console.log('----')
      if (action === 'opened') {
        opens.push(count);
        next = 'closed';
      } else {
        closes.push(count);
        next = 'opened';
      }
  });
  return {dates: dates, opens: opens, closes: closes};
}

function returnJSON(res, obj) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(obj)).end();
}

function trace(obj) {
  console.log(obj);
  return obj;
}

app.get('/issue_data.json', function(req, res) {
  var recent = new AV.Query(GlobalCount);
  recent.greaterThan('date', new Date(moment().subtract(30, 'days')));
  var opens = new AV.Query(GlobalCount);
  opens.equalTo('action', 'opened');
  var closes = new AV.Query(GlobalCount);
  closes.equalTo('action', 'closed');
  var query = AV.Query.and(recent, AV.Query.or(opens, closes));
  query.ascending('date');
  query.addAscending('action');
  query.find({
    success: function(results) {
      returnJSON(res, processForChart(results));
    },
    error: function(error) {
      console.error(error);
      res.status(500).end();
    }
  });
});

app.post('/issue_webhook', function(req, res) {
  if (!req.body.hasOwnProperty('action')) {
    console.log('request has no action');
    res.status(200).end();
  } else {
    var action = req.body.action;
    console.log('action:', action);
    var date = new Date();
    date.setHours(0, 0, 0, 0);
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