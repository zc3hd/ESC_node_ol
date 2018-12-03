# step 2 线上一键合并db

* 承接step 1：如何实时监听上传的数据库,并同时合并新的数据库？

* 假设现在这里是线上的环境，`db_from_out`是我们从demo_001约定好的线上接受db.tar.gz包的文件夹名称。
* 线上需要用到一个包`var watch = require('gulp-watch');`。
* 也需要对启动watch做pm2进程守护。
* 还只能写在`db_from_out`文件夹下面

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
      【删除原来的数据库】
      return tool._cmd(`mongo --host 127.0.0.1:27017 ${db_name} --eval "db.dropDatabase()"`)
    })
    .then(function() {
      【导入数据库】
      return tool._cmd(`mongorestore --host 127.0.0.1:27017 -d ${file.name}_ol ./${file.name}/`)  
    })
    .then(function() {
      console.log("导入完成");
    });

});
```

* 接下来，我需要把本地写的这个【index.js以及它的依赖和工具包】传入线上。见demo-003。
* 2018/12/3：线上合并数据库这是我自己的臆想吧，如果线上已经存在该数据库，线上传上来的数据是不能进行合并的。所以只能是先把线上的数据库删除掉，再导入我的数据库。合并？是实现不了的。
