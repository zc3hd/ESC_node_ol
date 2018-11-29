### 安装mongoDB

* mongoDB-v3.4的官方安装文档：`https://docs.mongodb.com/v3.4/tutorial/install-mongodb-on-ubuntu/`

```
0.注释阿里云的安装源
sudo vi /etc/apt/apt.conf
# xxxxxxxxxxxxxx

1.导入包管理系统使用的公钥。
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

2.创建DB下载的源地址（这里其实是改变了，把repo.mongodb.org换成mirrors.aliyun.com）
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

--------------------------------------------------
强制改变安装源为阿里云
sudo vi /etc/apt/sources.list.d/mongodb-org-3.4.list

http://mirrors.aliyun.com/mongodb/apt....
--------------------------------------------------

3.重新加载本地数据包
sudo apt-get update

4.下载
sudo apt-get install -y mongodb-org
```

```
【开启服务】
sudo service mongod start
# start: Job is already running: mongod

【停止服务】
sudo service mongod stop

【重启】
sudo service mongod restart

【连接】
mongo
```

### 修改mongoDB默认端口

```
sudo vi /etc/mongod.conf

----------------------------------------
port: 38889
----------------------------------------

sudo service mongod restart

【指定端口连接】
mongo --port 38889
```

