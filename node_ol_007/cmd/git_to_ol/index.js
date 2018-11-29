var fn = require('../cmd.js');
var me = new fn();


me._cmd('cd ../')
  .then(function() {
    return me._cmd('git add .')
  })
  .then(function() {
    return me._cmd('git commit -m "xx"')
  })
  .then(function() {
    return me._cmd('git push -u origin master')
  })
  .then(function() {
    console.log('上传git完成');
  });