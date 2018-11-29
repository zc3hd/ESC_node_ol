var process = require('child_process');
var conf = require('../conf.js');

/*
* 本项目数据库一键上传
*/

function db() {}
db.prototype = {
  init: function() {
    var me = this;
    me._bind();

    // 导出
    me._cmd(`mongodump -h 127.0.0.1:27017 -d ${conf.db} -o ./db_to_ol`)
      .then(function() {
        // 打包
        return me._cmd(`tar zcvf ./db_to_ol/${conf.db}.tar.gz ./db_to_ol/${conf.db}`)
      })
      .then(function() {
        // 删除
        return me._cmd(`rm -r ./db_to_ol/${conf.db}`)
      })
      .then(function() {
        // 上传
        return me._cmd(`scp -P ${conf.login_port} ./db_to_ol/${conf.db}.tar.gz ${conf.user}@${conf.ip}:/home/${conf.user}/${conf.db_dir_ol}/`)
      })
      .then(function() {
        console.log('上传完成');
      });


    // me._cmd(`node ./api_server/app.js`).then(function() {
    //  console.log('xx');
    // });
    // me._cmd(`gulp`).then(function() {})
  },
  _bind: function() {
    var me = this;
    var fns = {
      // 命令
      _cmd: function(shell) {
        return new Promise(function(resolve, reject) {
          process.exec(shell, function(error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error);
            }
            console.log(stdout, stderr)
            resolve();
          });
        });
      },
    };

    for (var key in fns) {
      me[key] = fns[key];
    }
  },
};
new db().init();
