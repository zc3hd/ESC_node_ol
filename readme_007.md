### 本地数据库-->导入-->线上

* 本地导出打包
```
1.本地数据库开机

2.在db_to_ol文件夹下备份本地数据库：
mongodump -h 127.0.0.1:27017 -d test(数据库名) -o .(到本地这个文件夹)
mongodump -h 127.0.0.1:27017 -d test -o .

* 导出后test数据库在db_to_ol文件夹下面就是test文件夹

3.压缩打包
tar zcvf 文件名.tar.gz test(文件夹)
```

* 上传到线上
```
1.线上新建文件夹
mkdir db_from_out

2.本地上传打包文件
scp -P 登录端口 ./文件名.tar.gz xx@公网IP:/home/cc/db_from_out/
```

* 线上解压、导入
```
cd db_from_out

【解压】
tar xvf 文件名.tar.gz
【删除包】
rm 文件名.tar.gz

【导入线上】
mongorestore --host 127.0.0.1:27017 -d test_ol(线上数据库名称) ./db_from_out/test(数据库名文件夹)/
```

* 测试
```
mongo -port 38889
show dbs
```

### 思考：

* **1.做完一个项目本地的数据库需要做的事情是：导出、打包、上传。可以在package.json里一次性搞完。**
```
  "scripts": {
    "ol": "mongodump -h 127.0.0.1:27017 -d test -o ./db_bak && tar zcvf ./db_bak/test.tar.gz ./db_bak/test && scp -P 12345 ./db_bak/test.tar.gz xx@公网IP:/home/xx/db_from_out/"
  },
```

* **2.通过node 执行shell命令**
```
详见demo_001:

var process = require('child_process');
process.exec('shutdown -h now',function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
```
