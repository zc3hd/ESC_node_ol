var conf = require('../../conf.js');
var fn = require('../cmd.js');
var me = new fn();

// 导出的路径、压缩、删除、上传
var _path = './cmd/db_to_ol';
/*
 * 本项目数据库一键上传
 */

me._cmd(`mongodump -h 127.0.0.1:27017 -d ${conf.db} -o ${_path}`)
  .then(function() {
    // 压缩
    return me._cmd(`tar zcvf ${_path}/${conf.db}.tar.gz ${_path}/${conf.db}`)
  })
  .then(function() {
    // 删除
    return me._cmd(`rm -r ${_path}/${conf.db}`)
  })
  .then(function() {
    // 上传
    return me._cmd(`scp -P ${conf.login_port} ${_path}/${conf.db}.tar.gz ${conf.user}@${conf.ip}:/home/${conf.user}/${conf.db_dir_ol}/`)
  })
  .then(function() {
    console.log('上传完成');
  });
