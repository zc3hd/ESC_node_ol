var Tool = require('../tool.js');
var tool = new Tool();
// 获取当前时间戳
var timestamp =Date.parse(new Date());

tool
  ._cmd('git add ../')
  .then(function() {
    return tool._cmd(`git commit -m "date:${tool._date(timestamp)}"`)
  })
  .then(function() {
    return tool._cmd('git push -u origin master')
  })
  .then(function() {
    console.log('上传git完成');
  });
