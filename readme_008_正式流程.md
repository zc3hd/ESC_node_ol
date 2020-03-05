# 正式发布流程

* 备案通过，开始进行域名正式挂载服务部署。

## 添加域名解析

* 具体怎么弄，看前面笔记。域名解析就是通过域名知道到哪个服务器IP，里面包含有域名的信息，到服务器端，找到nginx的转发，知道去哪个端口。

## 配置nginx

* `cd /etc/nginx/conf.d`
* `sudo vi www-8081.conf`

```js
upstream server {
    server 127.0.0.1:8081;
}
server {
    listen 80;
    server_name www.armincc.com;
    
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        proxy_pass http://server;
        proxy_redirect off;
    }
}
```

* `sudo nginx -s reload`

## FTP上传自己编译好的代码

## pm2 start ./app.js --name="plan_8081"

-----

## 更新

* 前端：直接拖上去；
* 后端：
  * `pm2 stop app_name|app_id`
  * `pm2 restart app_name|app_id`