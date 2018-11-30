'use strict';

var path = require('path');
var watch = require('gulp-watch');
var Tool = require('../tool.js');
var tool = new Tool();


// 指定监听的目录
var one = '../target/';
// 监听变化（add /upd/del）的文件
watch(path.join(__dirname, one, '*'), function(file) {

  // 不是压缩包
  if (file.extname != '.gz') {
    return;
  }
  var arr = file.stem.split('.');
  file.name = arr[0];

  tool
  // 解压
    ._cmd(`tar xvf ${file.basename} .`)
    .then(function() {
      // 导入
      return tool._cmd(`mongorestore --host 127.0.0.1:27017 -d ${file.name} ./${file.name}/`)
    })
    .then(function() {
      // 
      console.log("导入完成");
    });

});
