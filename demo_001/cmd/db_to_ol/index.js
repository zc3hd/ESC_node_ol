var conf = require('../../conf.js');
var Tool = require('../tool.js');
var tool = new Tool();

var path = require('path');


// 导出的路径、压缩、删除、上传
var _path = "./";

/*
 * 本项目数据库一键上传
 */

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










// // 导出的路径、压缩、删除、上传
// var _path = path.join(__dirname, '../../cmd/db_to_ol/');
// var _path_win = _path;

// var _path_arr = null;
// var _path_arr_1 = null;


// // console.log(_path);
// // console.log(path.sep);


// _path_arr = _path.split(":");
// _path_arr_1 = _path_arr[1].split("\\");
// _path_arr_1[0] = _path_arr[0];
// _path_arr_1[0] = _path_arr_1[0].toLowerCase();

// _path = _path_arr_1.join('/');
// _path = "/" + _path;

// console.log(_path_win, _path);
// /*
//  * 本项目数据库一键上传
//  */

// tool
// // 导出
//   ._cmd(`mongodump -h 127.0.0.1:27017 -d ${conf.db} -o ${_path_win}`)
//   .then(function() {
//     // 压缩
//     return tool._cmd(`tar -zcvP -f ${_path+conf.db+".tar.gz"} ${_path+conf.db}`)
//   })
//   // .then(function() {
//   //   // 删除
//   //   // return tool._cmd(`rm -r ${_path}/${conf.db}`)
//   // })
//   // .then(function() {
//   //   // 上传
//   //   return tool._cmd(`scp -P ${conf.login_port} ${_path}/${conf.db}.tar.gz ${conf.user}@${conf.ip}:/home/${conf.user}/${conf.db_dir_ol}/`)
//   // })
//   // .then(function() {
//   //   console.log('上传完成');
//   // });
