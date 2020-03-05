# Https

* 先有http服务；域名、Nginx、node服务全部配置成功；
* 阿里云SSL证书管理：`https://yundun.console.aliyun.com/?spm=5176.2020520154.products-recent.dcas.6cf3tUshtUshnH&p=cas#/overview/cn-hangzhou`

* 购买证书：

![1583407711453](assets/1583407711453.png)

* 选择个人版DV

![1583407745586](assets/1583407745586.png)

* 购买完成后，会出现一个未签发的证书，点击

![1583407798034](assets/1583407798034.png)

* 信息填入，自动DNS验证

![1583407945599](assets/1583407945599.png)

* 验证通过后，证书下载

![1583408108238](assets/1583408108238.png)

* 下载解压完成后，会有两个文件：

![1583408224255](assets/1583408224255.png)

* 看帮助文档：

![1583408261541](assets/1583408261541.png)

* 将下载的文件通过FTP上传到服务器上：

![1583408734990](assets/1583408734990.png)

![1583408808796](assets/1583408808796.png)

* 修改nginx配置：

![1583408623046](assets/1583408623046.png)

* 发生改变的部分：

![1583408987181](assets/1583408987181.png)

* 文件部分：重启Nginx `sudo nginx -s reload`

```cmd
upstream wxapp {
    server 127.0.0.1:8085;
}
server {
    listen 80;
    server_name wxapp.armincc.com;
    rewrite ^(.*)$ https://$host$1 permanent;   #将所有http请求通过rewrite重定向到https。
}
server {
    listen 443;
    server_name wxapp.armincc.com;
    ssl on;
    ssl_certificate /home/cc/ssl/8085_wxapp/3548822_wxapp.armincc.com.pem;
    ssl_certificate_key /home/cc/ssl/8085_wxapp/3548822_wxapp.armincc.com.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_prefer_server_ciphers on;


    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        proxy_pass http://wxapp;
        proxy_redirect off;

    }
}

```

