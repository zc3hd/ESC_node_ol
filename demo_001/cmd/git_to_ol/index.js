var path = require('path');
var Tool = require('../tool.js');
var tool = new Tool();


// 获取当前时间戳
var timestamp = Date.parse(new Date());
// 要提交的目录
var _url = path.join(__dirname,'../../../');



tool
  ._cmd(`git add ${_url}`)
  .then(function() {
    return tool._cmd(`git commit -m "date:${tool._date(timestamp)}"`)
  })
  .then(function() {
    return tool._cmd('git push -u origin master')
  })
  .then(function() {
    console.log('上传git完成');
  });



// console.log(1);
