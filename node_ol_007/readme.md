# 一键上传

* 该例子是从node-011拿过来的，
* 状态：前端gulp+后台express。已开发完成。
* 本来是想完成一键上传db，后面发现只要不是启动server类的，都可以设置为一键启动的方式。
* 于是就有了该项目一键项目的配置。（以后还有更多的优化）目录结构：
```
cmd/
 db_to_ol/  【里面写一键上传db的命令，且上传的包暂时都在该文件夹下面。】
 git_to_ol/  【上传GitHub的命令】
 tool.js 【所有命令行工具的构造函数，_cmd函数promise封装】
```

* conf.js 在外面，全局参数配置，就单独放在外面了。
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

### 一键上传db

* 本地上传数据库需要做这几件事：导出、打包、上传。可以在package.json中弄：

### 一键上传GitHub

* 这是由前面想到的，只要不是启动服务的，手动挡的，都可以配置命令进行一键启动。
```
  "scripts": {
    "esc_db": "node ./cmd/db_to_ol/index.js",
    "git": "node ./cmd/git_to_ol/index.js"
  },
```
