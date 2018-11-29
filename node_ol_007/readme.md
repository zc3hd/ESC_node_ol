# 一键上传数据库

* 该例子是从node-011拿过来的，
* 状态：前端gulp+后台express。已完成开发。

* 本地上传数据库需要做这几件事：导出、打包、上传。可以在package.json中弄：
```
  "scripts": {
    "ol": "node ./db_bak/db_bak.js"
  },
```

* 在conf.js添加服务器配置：
```
module.exports = {
  // 数据库名称
  db: "test",

  // 测试模式下的端口
  dev_port: 1010,

  // 打包后/测试时被代理的端口
  api_port: 1011,

  // ===========================服务器的参数
  // ol 登录端口
  login_port: 00000,
  // 登录用户名
  user: "xx",
  // 公网IP
  ip: "00.00.00.00",
  // 线上的上传到的文件夹
  db_dir_ol: 'db_from_out'
}
```

* db_bak.js
```
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

// 导出
me._cmd(`mongodump -h 127.0.0.1:27017 -d ${conf.db} -o ./db_bak`)
  .then(function() {
    // 打包
    return me._cmd(`tar zcvf ./db_bak/${conf.db}.tar.gz ./db_bak/${conf.db}`)
  })
  .then(function() {
    // 删除
    return me._cmd(`rm -r ./db_bak/${conf.db}`)
  })
  .then(function() {
    // 上传
    return me._cmd(`scp -P ${conf.login_port} ./db_bak/${conf.db}.tar.gz ${conf.user}@${conf.ip}:/home/${conf.user}/${conf.db_dir_ol}/`)
  })
  .then(function() {
    console.log('上传完成');
  });
```

