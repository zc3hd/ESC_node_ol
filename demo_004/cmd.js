var conf = require('./conf.js');
var path = require('path');
var Tool = require('./tool.js');
var tool = new Tool();



// =================================一键上传本地数据库

// 导出的路径、压缩、删除、上传
var _path = "./";

tool
// 导出
  ._cmd(`mongodump -h 127.0.0.1:27017 -d ${conf.db} -o ${_path}`)
  .then(function() {
    // 压缩
    return tool._cmd(`tar -zcvf ${_path}${conf.db}.tar.gz ${_path}${conf.db}`)
  })
  .then(function() {
    // 删除
    return tool._cmd(`rm -r ${_path}${conf.db}`)
  })
  .then(function() {
    // 上传
    return tool._cmd(`scp -P ${conf.login_port} ${_path}${conf.db}.tar.gz ${conf.user}@${conf.ip}:/home/${conf.user}/${conf.db_dir_ol}/`)
  })
  .then(function() {
    console.log('上传完成');
  });


// =================================一键上传文件到github

  // 获取当前时间戳
var timestamp = Date.parse(new Date());



// 要提交的目录
var _url = path.join(__dirname,'../../../');
// 要提交的源的名字
var origin = 'name';


tool
  ._cmd(`git add ${_url}`)
  .then(function() {
    return tool._cmd(`git commit -m "date:${tool._date(timestamp)}"`)
  })
  .then(function() {
    return tool._cmd(`git push -u ${origin} master`)
  })
  .then(function() {
    console.log('上传git完成');
  });