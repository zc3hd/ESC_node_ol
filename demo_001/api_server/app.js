var express = require('express');
var path = require('path');
var app = express();
var conf = require('../conf.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/' + conf.db);


// 链接数据库
mongoose.connection.once('open', function() {
  console.log(conf.db + "数据库->开启");
  // 提供静态文件
  app.use(express.static(path.join(__dirname, '../webapp/')));
  // post
  app.use(bodyParser.urlencoded({ extended: false }))


  // api
  var book = require('./moudles/book/index.js');
  new book(app).init();

  // api
  var user = require('./moudles/user/index.js');
  new user(app).init();

  // api
  var label = require('./moudles/label/index.js');
  new label(app).init();


  app.listen(conf.api_port);
  console.log("server running at " + conf.api_port);
});
