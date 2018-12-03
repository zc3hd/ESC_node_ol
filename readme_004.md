### PM2

* 希望：访问IP或域名访问、稳定。部署和进程管理工具，解决【稳定问题】
```
npm i pm2 -g 【安装】
pm2 start app.js  【开启一个服务】
pm2 start app.js --name="api" 【命名为api】
pm2 restart app.js


pm2 stop app_name|app_id  【停止】
pm2 stop all

pm2 list  【查看所有开启的服务】
pm2 show app_name 【查看详细信息】


pm2 logs 【查看实时日志】  

Ctrl+c退出 pm2模式
```

### nginx

* 在cc用户下，没有root权限让服务跑在0-1024的端口。
* 先做一个：nginx对80端口进行监听，把80的访问分配给node启动的端口。用户访问服务器的默认是80端口。

```
不需要apache
update-rc.d -f apache2 remove
sudo apt-get remove apache2
```

* 安装nginx

```
sudo apt-get update
sudo apt-get install nginx
nginx -v
```

* 接下来开始新建文件进行配置（命名习惯：二级域名+服务端口）

```
cd /etc/nginx/conf.d
sudo vi armincc-8081.conf

------------------------------------
【这个下面可以放很多启动的服务，配合下面实现：服务器的反向代理】
upstream armincc {
    server 127.0.0.1:8081;【服务启动的端口和名字】
}
server {
    【监听端口】
    listen 80;
    server_name xx.xx.xx.xx(这里是公网IP);
    
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        【实现代理，就是把上面的配置挂载到这。】
        proxy_pass http://armincc;
        proxy_redirect off;
    }
}
```

* 回到上层文件夹，查看有没有这个配置
```
cd ..
sudo vi nginx.conf

【开启这个配置】
include /etc/nginx/conf.d/*.conf;
```

* 监测有没有错误和重启，默认80端口可以访问了
```
sudo nginx -t
sudo nginx -s reload
```

* 现在内部的端口转发就跑通了。也只是【公网IP】就可以访问到【公网IP】+8081的服务。真实情况不需要这样，直接IP加端口就行。
* 如果现在是开启了多个服务，8081/8082，地址栏直接是：IP+8081、IP+8082直接访问就行，在域名没有备案成功时，不需要nginx做代理，直接访问就行。

------------------------

* 隐藏前端页面res报文头信息的nginx信息

```
cd /etc/nginx/
sudo vi nginx.conf

# Basic Settings
server_tokens off;【把注释拿掉】

sudo nginx -s reload
sudo service nginx reload
```

