### DNS解析和nginx转发

* 备案没有通过之前，可以通过IP+PORT进行访问，不需要做nginx转发。
* 通过后，就是做DNS域名配置和服务器上的nginx转发。
* 我们备案的是顶级域名，那么二级域名都是DNS配置的。各种二级域名的配置都是涉及到解析，服务器（DNS）把二级域名解析到IP。使用阿里云的DNSPOD云解析。

* 一个二级域名只能对一个IP地址（服务器），但是一个IP地址可以对应多个二级域名。
* 总的实现过程：我们的二级域名都找到我们的【公网IP】，访问的信息里有域名的信息，通过nginx，服务器就需要知道哪个URL要进入哪个PORT。

#### 1.添加二级域名
```
【记录类型】选择项
A:域名会指向一个IP地址（应用：就是指向服务器）
CNAME:域名会指向一个域名（应用：使用第三方服务厂商，例如七牛的文件服务器。）

【主机记录】手动填写
www(二级域名)
@（解析顶级域名）
*（泛解析）

【记录值】手动填写
选记录类型为A，就需要填写一个IP地址
选CNAME，就需要填写一个域名
```

```
【主页】
主机记录：www 
记录类型：A
记录值：公网IP
```

```
【指到域名地址】
例如：七牛的图片服务
1.在七牛添加一个自定义域名，这个域名是我们DNS那准备设置的一个域名。
2.找到七牛的CNAME配置说明，把那个配置项写到DNS里二级域名选择CNAME，后面的记录值里。
```

#### 2.nginx转发：这才是转发
```
cd /etc/nginx/conf.d
sudo vi www-8081.conf

------------------------------------
【www只是个名字,不是配置项】下面可以写多个服务，然后www.armincc.com访问就能找到www下面的提供的服务，这就是反向代理。
upstream www {
    server 127.0.0.1:8081;
}
server {
    【监听端口】
    listen 80;
    server_name www.armincc.com;【把刚才在DNS写的域名写到这】
    
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;

        【实现代理，就是把上面的配置挂载到这。】
        proxy_pass http://www;
        proxy_redirect off;
    }
}
------------------------------------

sudo nginx -s reload
```

#### 过程

* 配置的DNS二级域名：(name--->IP)知道域名要到哪个服务器上。
* IP的服务器上，nginx拿到name,就知道要去哪个port。（name-->port）。
