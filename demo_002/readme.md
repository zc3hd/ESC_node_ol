# step 2 线上一键合并db

* 承接step 1：如何实时监听上传的数据库,并同时合并新的数据库？

* 假设现在这里是线上的环境，`db_from_out`是我们约定的从demo_001约定好的线上接受db.tar.gz包的文件夹。
* 用到一个包`var watch = require('gulp-watch');`，因为是tar的打包压缩，需要相对路径，需要在文件夹下面执行index.js,同时需要pm2进程守护。

```
【db_from_out/index.js】

var one = '../db_from_out/'; 【指定监听的目录】

【可监听（add /upd/del）的文件】
watch(path.join(__dirname, one, '*'), function(file) {

  if (file.extname != '.gz') {
    return;
  }
  var arr = file.stem.split('.');
  file.name = arr[0];

  tool
    ._cmd(`tar xvf ${file.basename} .`)【解压】
    .then(function() {
      
      return tool._cmd(`mongorestore --host 127.0.0.1:27017 -d ${file.name}_ol ./${file.name}/`)  【/导入】
    })
    .then(function() {
      console.log("导入完成");
    });

});
```

* 接下来，我需要把本地写的这个【index.js以及它的依赖和工具包】传入线上。
* 见demo-003。