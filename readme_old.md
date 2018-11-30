




### 6.1 本地生成玉佩

>$ ssh-keygen -t rsa -b 4096 -C "邮箱地址（随便写其实可以）" 回车
不要输入密码

>$ cat id_rsa.pub

* 开启ssh代理

>$ eval "$(ssh-agent -s)" 

* 将钥匙加入代理中

>$ ssh-add ~/.ssh/id_rsa


* 其他操作

>$ sudo rm -rf 文件名

>$ sudo mv 要改的文件名 新的文件名

* 测试下本机的有没有密码，有的需要需要重新配置RSA文件。重新配置下GitHub的远端仓库

>$ ssh -T git@github.com




### 6.2 服务器

>$ ssh xx@ip:***** 

>$ sudo apt-get update


* 安装Openssh服务端

>$ sudo apt-get install openssh-server

>sudo service ssh start


* 线上生成秘钥

>ssh-keygen -t rsa

* 转本地,将本地客户端上的公钥复制到SSH服务端或者主机，来创建对客户端的信任关系。

>ssh-copy-id xx@ip_address

* 修改配置

>sudo nano /etc/ssh/sshd_config

```
# Authentication:
LoginGraceTime 120
StrictModes yes

RSAAuthentication yes
PubkeyAuthentication yes
#AuthorizedKeysFile     %h/.ssh/authorized_keys

# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
# For this to work you will also need host keys in /etc/ssh_known_hosts
RhostsRSAAuthentication no

# similar for protocol version 2
HostbasedAuthentication no

```

> sudo service ssh restart





## 11.搭建nodejs的生产环境

* 特别注意，阿里云的后台的安全组得设置，服务器上的防火墙和iptables都得开启。

* 更新

>$ sudo apt-get update



* 安装

>$ sudo apt-get install vim openssl build-essential libssl-dev wget curl git 

* 安装nvm https://github.com/creationix/nvm

>$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash



* 我发现按照上面的不行，按照下面的得

>$ git clone git://github.com/creationix/nvm.git ~/.nvm

* 这句话就是载入nvm的使用环境

>$ source ~/.nvm/nvm.sh


* 然后再

>$ nvm install v6.9.5

>$ nvm use v6.9.5

>$ nvm alias default v6.9.5

>$ node -v

>$ npm  --registry=https://registry.npm.taobao.org install -g npm

>$ npm  --registry=https://registry.npm.taobao.org install -g nrm

>$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

>$ npm i pm2 -g


* 试着来个8081

>$ vi app.js(8081)

>$ node app.js 当前用户没有权限让服务跑在80端口

>$ sudo vi /etc/iptables.up.rules

```
# http https 8081
-A INPUT -p tcp --dport 8081 -j ACCEPT
```

>$ sudo iptables-restore < /etc/iptables.up.rules






## 12.提供静态服务pm2  nginx

* 持续提供服务
* 通过域名访问


### 12.1 pm2进程守护

>$ npm i pm2 -g

>$ pm2 start app.js

* 查看所有

>$ pm2 list

* 详细信息

>$ pm2 show app



### 12.2 nginx

* 停止apache2

>$ sudo service apache2 stop

>$ sudo service apache stop

* 删除apache2

>$ update-rc.d -f apache2 remove

>$ sudo apt-get remove apache2


* 更新包列表

>$ sudo apt-get update

>$ sudo apt-get install nginx

>$ cd /etc/nginx/

>$ ls

>$ cd conf.d

>$ ls

【注意里面必须有分号的】
>$ sudo vi arminc-cn-8081.conf

```
upstream arminc {
    server 127.0.0.1:8081;
}
server {
    listen 80;
    server_name 公网IP;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        proxy_pass http://arminc;
        proxy_redirect off;
    }
}
```

>$ cd ..

>$ ls

* 查看文件配置,看有没有这个include

>$ sudo vi nginx.conf

```
include /etc/nginx/conf.d/*.conf;
```

* 测试配置是否有错

>$ sudo nginx -t

* 重启--到这默认80端口可以访问了

>$ sudo nginx -s reload




### 12.3 前端页面的nginx版本信息修改

* 前端页面中返回的请求中响应的--header里面的server里可以看到nginx的版本信息

>$ cd /etc/nginx/

>$ sudo vi nginx.conf

```
# Basic Settings

server_tokens off;
```

* 重启

>$ sudo nginx -s reload

>$ sudo service nginx reload











## 14.项目部署!!!!

* 注册码云--免费的私有仓库注册
* 添加本地的id_rsa.pub公钥。

### 本地代码上传私有仓库

* 添加完远端后，更新
$ git fetch

* 合并
$ git merge orgin/master

* 快速下载合并
$ git pull name master

* 远端提交
$ git push -u orgin master


### 服务器上id_rsa.pub给码云

* 打印id_rsa.pub

* 把刚才的key给了码云后台设置

* 一定要复制一个要上传的码云的项目的SSH地址在线上服务器下载下，把这个通道走下。就是加入线上的信任列表

>$ mkdir temp

>$ cd temp

>$ git clone 码云上website的git地址

>$ cd website那个文件夹下面

>$ git clone 其他项目的git地址

* 建议把所有的项目都进行clone下，确保所有的通道都可以通着。

### 本地准备工作  ecosystem.json

* 本地新建ecosystem.json

```
{
  // Applications part
  "apps": [
    // 
    {
      // pm2发布服务的名字
      "name": "website",
      // 入口脚本
      "script": "app.js",
      // 传入的变量
      "env": {
        "COMMON_VARIABLE": "true"
      },
      // 生产环境的变量
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ],
  // 部署的任务
  "deploy": {
    "production": {
      // 发布应用的用户
      "user": "cc",
      // 主机IP
      "host": ["47.95.249.44"],
      // Branch
      "ref": "origin/master",
      // 告诉服务器下来的仓库的地址
      "repo": "git@gitee.com:arminc/website.git",
      // 需要把项目部署到服务器的哪个目录下面
      "path": "/www/website/production",
      // key 校验取消
      "ssh_options": "StrictHostKeyChecking=no",
      // 部署的时候传入的变量
      "env": {
        "NODE_ENV": "production"
      },
      "post-deploy": "source ~/.nvm/nvm.sh && node -v && pm2 startOrRestart ecosystem.json --env production"
    }
  }
}

```

```
{
  "apps": [{
    "name": "website",
    "script": "app.js",
    "env": {
      "COMMON_VARIABLE": "true"
    },
    "env_production": {
      "NODE_ENV": "production"
    }
  }],
  "deploy": {
    "production": {
      "user": "xx",
      "host": ["公网IP"],
      "port": "38888",
      "ref": "origin/master",
      "repo": "git@gitee.com:arminc/website.git",
      "path": "/www/website/production",
      "ssh_options": "StrictHostKeyChecking=no",
      "env": {
        "NODE_ENV": "production"
      },
      "post-deploy": "source ~/.nvm/nvm.sh && node -v && pm2 startOrRestart ecosystem.json --env production"
    }
  }
}
```

* 注意这里需要在post-deploy里面 source ~/.nvm/nvm.sh




------------------------------------------

### 部署的任务端口的配置

* 在里面云后面进行安全组设置

* 在iptables进行设置

>$ sudo vi /etc/iptables.up.rules

```
# http https 8081
-A INPUT -p tcp --dport 8081 -j ACCEPT
```

>$ sudo iptables-restore < /etc/iptables.up.rules


### 线上准备工作 ~/.bashrc

* 部署可能会出错 pm2没有找到。

>$ sudo vi ~/.bashrc

```
#注释掉
#case $- in
#    *i*) ;;
#      *) return;;
#esac
```


* 创建文件夹，注意这里是/www，是和home平行的/www（上面的本地的ecosystem.json--path的路径）

>$ sudo mkdir /www

>$ cd /www

>$ sudo mkdir website

>$ pwd
/www/website

* 升级website的权限（这里不合适，需要把当前用户加入权限组）

>$ sudo chmod 777 website


### 本地远程部署

>$ git add .

>$ git commit -m 'add file ecosystem.json'

* 初始化远程服务器的目录

>$ pm2 deploy ecosystem.json production setup

* 部署和启动

>$ pm2 deploy ecosystem.json production



### 试端口

* IP:8081




### DNSPOD域名解析

* 万网转DNSPOD域名解析 https://support.dnspod.cn/Kb/showarticle/tsid/40/

* 记录类型--A记录就是指向一个IP地址，CNAME就是指向到另外一个域名。

* 阿里云

```
【主页】所有的项目的集合
主机记录：www 
记录类型：A
记录值：公网IP
```


```
【项目一】
主机记录：xm1 
记录类型：A
记录值：公网IP
```

```
【项目二】
...
```

* 这里只是添加记录值

* DNS-cname:有七牛域名解析的学习

* DNSPOD-A记录 www 47.95.249.44()，这里是设置域名，指向一个IP地址。


### 绑定域名到Nginx单独设置

* 修改nginx/conf.d/www-arminc-cn-8081.conf【这里是分别设置，server_name指的的就是设置的域名，就是那个IP,这里其实就是绑定域名到本地的自己的服务8081端口】

```
server_name:把刚才在DNS写的域名写到这
```

* 设置以后，服务用设置的域名访问，或者用IP：8081访问。

* upstream arminc【upstream就是个名字而已】

>$ sudo nginx -s reload


### 域名访问

* www.arminc.cn


### 线上查看

* 这句话就是载入nvm的使用环境

>$ source ~/.nvm/nvm.sh

>$ pm2 ls





### 【!!!部署需要连接数据库的服务】

#### 任务端口的配置

* 在里面云后面进行安全组设置

* 在iptables进行设置

>$ sudo vi /etc/iptables.up.rules

```
# http https 8081
-A INPUT -p tcp --dport 8082 -j ACCEPT
```

>$ sudo iptables-restore < /etc/iptables.up.rules


#### 线上创建文件夹

* 创建文件夹，注意这里是/www，是和home平行的/www（上面的本地的ecosystem.json--path的路径）

>$ cd /www

>$ sudo mkdir teaching_assess

>$ pwd
/www/teaching_assess

* 升级teaching_assess的权限（这里不合适，需要把当前用户加入权限组）

>$ sudo chmod 777 -R teaching_assess


#### 本地服务的配置

* app.js

```
var conf = {
  port:8002,
};

// -------------------------------------环境选择
var env = process.env.NODE_ENV || 'dev';

// 开发模式
if (env=='dev') {
  conf.db_url = "mongodb://localhost/teaching_assess";
}
// 线上
else {
  conf.db_url = "mongodb://teaching_assess_runner:123456@127.0.0.1:38889/teaching_assess";
}

mongodb://teaching_assess_runner【读写用户】:123456【密码】@127.0.0.1:38889/teaching_assess【线上的数据库名字】
```

* 本地新建ecosystem.json

```
"post-deploy": "source ~/.nvm/nvm.sh && npm install && pm2 startOrRestart ecosystem.json --env production"
```

* 一般都是在线上进行编译，所以要进行线上编译，在.gitignore上进行忽略编译后的文件夹。



### DNSPOD域名解析

* DNSPOD-A记录 www 47.95.249.44()，这里是设置域名，指向一个IP地址。


### 绑定域名到Nginx单独设置

>$ sudo cp www-arminc-cn-8081.conf tech-arminc-cn-8082.conf

* 修改/etc/nginx/conf.d/www-arminc-cn-8081.conf【这里是分别设置，server_name指的的就是设置的域名，就是那个IP,这里其实就是绑定域名到本地的自己的服务8081端口】

```
server_name:把刚才在DNS写的域名写到这

# nginx --静态文件的加载
location ~* ^.+\.(css|eot|svg|ttf|woff|woff2|jpg|jpeg|gif|png|js|html) {
    root /www/teaching_assess/production/current/webapp;
}

```

* 设置以后，服务用设置的域名访问，不能用8082访问，好像是静态文件的iptables允许。

* upstream arminc【upstream后面就是个名字而已】

>$ sudo nginx -s reload


### 本地远程部署

>$ git add .

>$ git commit -m '******'

* 初始化远程服务器的目录

>$ pm2 deploy ecosystem.json production setup

* 部署和启动

>$ pm2 deploy ecosystem.json production


### 域名访问

* tech.arminc.cn

### 线上查看

>$ source ~/.nvm/nvm.sh

>$ pm2 ls

>$ pm2 logs


### 【!!!其他操作】

* 查看自己的进程号

>$ sudo netstat -antup

* 查找对应的父级的进程号

>$ ps -ef

* 关闭进程

>$ sudo kill 进程号

* 那会遇见一个问题，就是我重新部署一个服务报错说：
* Error: Cannot find module '/Users/wyb/.nvm/versions/io.js/v3.0.0/lib/node_modules/pm2/lib/ProcessContainerFork.js'
* 下面有个回答说是：原因是你pm2 env被修改，请尝试运行下面的命令从你的主目录中删除你的pm2 env目录
* 这样操作就是完全不能用npm nvm pm2等一系列全局工具。
* 
* 我猜可能要修改~/.pm2/dump.pm2这个文件吧！！！一会试试













## 15.mongodb

### 15.1安装

* 查看本地版本,本地成功启动MongoDB后，再打开一个命令行窗口输入mongo，连接的时候就可以看到版本号；

* 官方地址 -- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

* 安装步骤安装官方的来,在安装过程中可能会错误，就是下载的地址是阿里云的服务器。

### 注释阿里云下载源地址

* 停止阿里云的安装源

>$ sudo vi /etc/apt/apt.conf

```
# 注释掉第一行
```

>$ wq!

### 改变mongo下载的源为阿里云的下载源

* 重新安装，步骤安装官方的来

* 最后一步安装的时候感觉慢，ctrl+C停止掉

* 打开mongo的配置

>$ sudo vi /etc/apt/sources.list.d/mongodb-org-3.4.list

```
# 强制改变安装源为阿里云
http://mirrors.aliyun.com/mongodb/apt....
```

* 直接回根路径

>$ cd 


* 重新跑官方的第3，第4步

>$ sudo apt-get update

>$ sudo apt-get install -y mongodb-org


* 开启服务

>$ sudo service mongod start
start: Job is already running: mongod

* 停止服务

>$ sudo service mongod stop

* 重启服务

>$ sudo service mongod restart

* 查看开启成功on port 27017

>$ cat /var/log/mongodb/mongod.log

* 连接数据库不成功

>$ mongo



--------------------------

### 连接数据库不成功，新增iptables的规则

* 因为本地iptables没有这个规则
* 配置iptables

>$ sudo vi /etc/iptables.up.rules

```
# 在ping下面
# mongodb 
-A INPUT -s 127.0.0.1 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
-A OUTPUT -d 127.0.0.1 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
```

>$ wq!

* iptables-规则重新生效

>$ sudo iptables-restore < /etc/iptables.up.rules

* 连接数据库成功

>$ mongo

>ctrl+C:退出



------------------------------------

### 修改数据库的默认端口

>$ sudo vi /etc/mongod.conf

```
port: 38889
```

>$ sudo service mongod restart

* 修改iptables防火墙的里面端口

* 指定端口，连接数据库成功
>$ mongo --port 38889



------------------------------------

### 15.2 导入本地测试完整的数据库

### 本地数据库导出

* 先要--数据库--开机

* 在备份的文件夹下面打开git-bash

>$ mongodump -h 127.0.0.1:27017 -d 数据库名 -o 备份的名称-backup

* 打包

>$ tar zcvf 文件名.tar.gz 备份的名称-backup

### 上传到线上

* 先在服务器上新建一个文件夹

>$ mkdir dbbackup

* 上传服务器 38888是登录的端口

>$ scp -P 38888 ./文件名.tar.gz cc@公网IP:/home/cc/dbbackup/

### 线上解压及导入

>$ cd dbbackup

* 解压缩

>$ tar xvf 文件名.tar.gz

* 导入数据库

>$ mongorestore -host 127.0.0.1:38889 -d 线上数据库名称 ./dbbackup/备份的名称-backup/数据库名(文件夹)/

* 开机测试是否导入成功

>$ mongo -port 38889

>$ use 数据库名

>$ show tables


------------------------------------

### 本地导出单张表

>$ mongoexport -d 本地数据库名 -c 表名 -o ./movie-users.json

### 上传服务器

>$ scp -P 38888 ./movie-users.json cc@公网IP:/home/cc/dbbackup/

### 导入数据库

>$ cd dbbackup

* 导入单表

>$ mongoimport -h 127.0.0.1:38889 -d imooc-movie(线上数据库名称) -c users（表的名字） ./movie-users.json

* 开机测试

>$ mongo -port 38889

>$ use imooc-movie（数据库名）

>$ show tables
users

* 退出数据库ctrl+C

>$ exit

------------------------------------

### 删除整个数据库

>$ mongo --host 127.0.0.1:38889 imooc-movie（数据库名） --eval "db.dropDatabase()"

* 进入数据库查看

>$ mongo -port 38889

>$ show dbs --就没有imooc-movie这个数据库了


* 退出数据库

>$ exit 

------------------------------------




### 15.2 mongo的权限设置

* 1、进入数据库

>$ mongo --port 38889

* 2、使用admin数据库

>$ use admin

* 2.1、创建管理员

>$ db.createUser({user:'imooc_cases_owner',pwd:'xx*cc*0903',roles:[{role:'userAdminAnyDatabase',db:'admin'【指定数据库】}]})

* 2.2、授权

>$ db.auth('imooc_cases_owner','xx*cc*0903');
1

------------------------------------

【切换数据库】

>$ use imooc-movie

【a、创建读写管理员】

>$ db.createUser({user:'imooc_movie_runner',pwd:'xx*cc*0903',roles:[{role:'readWrite',db:'imooc-movie'【指定数据库】}]})

【b、创建备份管理员】
>$ db.createUser({user:'imooc_movie_wheel',pwd:'xx*cc*0903',roles:[{role:'read',db:'imooc-movie'}]})


【设置其他数据库】
>$ use admin
>$ db.auth('imooc_cases_owner','xx*cc*0903')

>$ use imooc-app

>$ db.createUser({user:'imooc_app_runner',pwd:'xx*cc*0903',roles:[{role:'readWrite',db:'imooc-app'【指定数据库】}]})

>$ db.createUser({user:'imooc_app_wheel',pwd:'xx*cc*0903',roles:[{role:'read',db:'imooc-app'【指定数据库】}]})


--------------------------------------

### 开启用户验证

>$ sudo vi /etc/mongod.conf

```
# 拿掉注释
security:
  authorization: enabled(enabled前面有空格)
```

>$ wq!

【配置生效】
>$ sudo service mongod restart

【1、进入数据库】
>$ mongo --port 38889
>$ show dbs 【会报错】



### 生效后的登录

【选择数据库】
>$ use admin

【登录数据库】
>$ db.auth('imooc_cases_owner','xx*cc*0903')

>$ show dbs 

【退出数据库】
>$ exit

【有权限的登录到某个数据库】
>$ mongo 127.0.0.1:38889/imooc-movie（数据库名字） -u imooc_movie_runner -p xx*cc*0903

>$ show tables

>$ db.users.find({})

--------------------------------------

### 15.4 线上有权限的数据库的迁移

#### 线上新建要导出数据的文件夹及导出数据

【线上新建要导出数据的文件夹】
>$ mkdir db

>$ cd db

【导出线上数据库】
>$ mongodump -h 127.0.0.1:38889 -d indust-app(数据库名称) -u indust_app_wheel(备份的用户) -p xx*cc*0903 -o indust-app-old(导出文件的名字)

【打包】
>$ tar zcvf indust-app-old.tar.gz（要打包的名字） indust-app-old/(需要被打包的文件夹)

>$ cd db

【导出一张表】
>$ mongoexport -h 127.0.0.1:38889 -d imooc-movie(要导出表的数据的名字) -u indust_movie_wheel(备份的用户) -p xx*cc*0903 -c users（表名）-q '{"name":{$ne:null}}' -o ./movie-users-old.json(导出后的名字名)

--------------------------------------

#### 下载数据到本地电脑

【下载数据库】
>$ scp -P 38888 cc@公网IP:/home/cc/db/indust-app-old.tar.gz ./(下载到当前的文件夹)

【下载单表】
>$ scp -P 38888 cc@公网IP:/home/cc/db/movie-users-old.json ./(下载到当前的文件夹)

--------------------------------------

#### 另外服务器线上新增要上传的数据的文件夹及上传刚才下载的数据

【上传到新的服务器】
>$ mkdir newdb



* 切换本地

【上传数据库】
>$ scp -P 38888 ./indust-app-old.tar.gz(本地刚刚下载的压缩包) cc@公网IP:/home/cc/newdb/

【上传单表】
>$ scp -P 38888 ./movie-users-old.json(本地刚刚下载的单表) cc@公网IP:/home/cc/newdb/



* 切换线上

【进入newdb】
>$ cd newdb

>$ ls 发现文件已经上传了。

【解压缩】
>$ tar xvf indust-app-old.tar.gz

--------------------------------------

#### 线上创建新的数据库

* 先进行创建数据库和用户才能进行导入数据

【认证】
>$ use admin

【登录数据库】
>$ db.auth('imooc_cases_owner','xx*cc*0903') 
1

【新建--新的--小程序的数据库】
>$ use indust-app-target

【a、创建读写管理员】

>$ db.createUser({user:'indust-app-target_runnner',pwd:'xx*cc*0903',roles:[{role:'readWrite',db:'indust-app-targett'【指定数据库】}]})

【b、创建备份管理员】
>$ db.createUser({user:'indust-app-target_wheel',pwd:'xx*cc*0903',roles:[{role:'read',db:'indust-app-target'【指定数据库】}]})

------------------------------------------

【认证】
>$ use admin

【登录数据库】
>$ db.auth('imooc_cases_owner','xx*cc*0903') 
1

【新建--新的--电影的数据库】
>$ use imooc-movie-target

【a、创建读写管理员】

>$ db.createUser({user:'imooc_movie_target_runnner',pwd:'xx*cc*0903',roles:[{role:'readWrite',db:'imooc-movie-target'【指定数据库】}]})

【b、创建备份管理员】
>$ db.createUser({user:'imooc_movie_target_wheel',pwd:'xx*cc*0903',roles:[{role:'read',db:'imooc-movie-target'【指定数据库】}]})

>$ exit

--------------------------------------

#### 新的服务器：把上传到的文件夹的数据导入新建的数据库

【导入数据库】
>$ mongorestore -h 127.0.0.1:38889 -d indust-app-target（线上新建的数据库名称）-u indust-app-target_runnner -p xx*cc*0903 ./newdb/indust-app-old/indust-app/

【导入单表】
>$ mongoimport -h 127.0.0.1:38889 -d imooc-movie-target(线上新建的数据库名称) -u imooc-movie-target_runnner -p xx*cc*0903 -c users ./newdb/movie-users-old.json

--------------------------------------

#### 查看是否导入成功

【有权限的登录到新建的数据库】
>$ mongo 127.0.0.1:38889/indust-app-target（数据库名字） -u indust-app-target_runner -p xx*cc*0903

>$ show tables

>$ db.users.find({});

【有权限的登录到新建的数据库】
>$ mongo 127.0.0.1:38889/imooc-movie-target（数据库名字） -u imooc_movie_target_runner -p xx*cc*0903

>$ show tables

>$ db.users.find({});

【退出数据库】
>$ exit

-----------------------------------

### 15.5 线上数据的定时备份

#### 数据定时备份本地

>$ ls 

>$ mkdir tasks

>$ cd tasks

【新建一个脚本】
>$ vi movie.backup.sh

```
#!/bin/sh

backUpFolder=/home/cc/backup/movie
date_now=`date +%Y_%m_%d_%h%M`
backFileName=movie_$date_now

cd $backUpFolder
mkdir -p $backFileName

mongodump -h 127.0.0.1:38889 -d imooc-movie(数据库的名称) -u imooc_movie_wheel(备份的用户) -p xx*cc*0903 -o $backFileName(导出文件的名字)

tar zcvf $backFileName.tar.gz（要打包的名字） $backFileName

rm -rf $backFileName
```

【回到根目录】
>$ cd

>$ mkdir backup

>$ cd backup

>$ mkdir -p movie

>$ cd

>$ sudo sh ./tasks/movie.backup.sh

【打开定时任务管理器】
>$ crontab -e 

```
# 凌晨的13分
13 00 * * * sh /home/cc/tasks/movie.backup.sh
```

>$ ctrl+X

>$ shinf+Y



### 数据上传到七牛

$ cd tasks

$ vi upload.js

```
var qiniu = require("qiniu");

var parts = process.env.NODE_ENV.split('@');
var file = parts[1]+'.tar.gz';
var filePath = parts[0]+'/'+file;


//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'Access_Key';
qiniu.conf.SECRET_KEY = 'Secret_Key';

//要上传的空间名称
bucket = 'imoocdeploydb';

//上传到七牛后保存的文件名
key = file;

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}
//生成上传 Token
token = uptoken(bucket, key);

//要上传文件的本地路径
//filePath = filePath

//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId);       
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}


//调用uploadFile上传
uploadFile(token, key, filePath);

```

$ :wq!

$ vi movie.backup.sh

```
#!/bin/sh

backUpFolder=/home/cc/backup/movie
date_now=`date +%Y_%m_%d_%h%M`
backFileName=movie_$date_now

cd $backUpFolder
mkdir -p $backFileName

mongodump -h 127.0.0.1:38889 -d imooc-movie(数据库的名称) -u imooc_movie_wheel(备份的用户) -p xx*cc*0903 -o $backFileName(导出文件的名字)

tar zcvf $backFileName.tar.gz（要打包的名字） $backFileName

rm -rf $backFileName

NODE_ENV = $backUpFolder@$backFileName node /home/cc/tasks/upload.js
```

【tasks文件夹下面安装七牛】
$ npm install qiniu

【手动直接调用】
$ ./movie.backup.sh

【打开定时任务管理器】
$ crontab -e 

```
# 凌晨的4点,执行备份
00 4 * * * sh /home/cc/tasks/movie.backup.sh

# 凌晨的8点,执行备份
00 8 * * * sh /home/cc/tasks/movie.backup.sh
```

* 建议是各个数据库对应各个的备份脚本。以防有个数据库备份失败，其他数据库会备份失败。
