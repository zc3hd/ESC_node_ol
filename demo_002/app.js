'use strict';

var path = require('path');
var watch = require('gulp-watch');
var Tool = require('./tool.js');
var conf = require('./conf.js');
var tool = new Tool();


// 指定监听的目录
var one = './target/';


// 监听变化（add /upd/del）的文件
watch(path.join(__dirname, one, '*'), function(file) {


  // 返回这个路径
  console.log(file.path);
  console.log(file.extname)
  console.log(file.basename);

  if (file.extname != '.gz') {
    return;
  }



  tool
  // 解压
    ._cmd(`tar xvf ${one+file.basename} ${one}`)
    .then(function() {
      // 
      // return tool._cmd(`tar zcvf ${_path}/${conf.db}.tar.gz ${_path}/${conf.db}`)
    });

});
