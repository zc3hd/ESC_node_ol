### 修改22端口

* 默认是22端口进行登录
* 在云后台配置登录端口的安全组：xxxxx/xxxxx 授权对象：0.0.0.0/0（安全组就是各种端口的）

```
【进入这个配置文件】
sudo vi /etc/ssh/sshd_config

----------------------------------------------------
【修改端口】
Port 38888

【允许登录的用户，这个没必要加】
PasswordAuthentication yes 【在这个下面加】
AllowUsers cc

**************************************
# 允许root登录:不允许【没必要】
PermitRootLogin no

# 是否允许密码登录方式
PasswordAuthentication no

# 不允许空密码登录
PermitEmptyPasswords no
----------------------------------------------------
【ESC】【ctrl+:】【wq!】

【重启】
sudo service ssh restart
```

* 测试 ssh -p xxxxx xx@0.0.0.0
* 快速部署的话，可以忽略下面的配置，就是相对来说服务器安全会薄弱些。正式线上应该有下面的步骤。

-----------------------------------------------------

### 配置iptables-防火墙

```
升级操作系统
sudo apt-get update && sudo apt-get upgrade

清除iPtables的所有规则
sudo iptables -F

新建规则文件
sudo vi /etc/iptables.up.rules
```

```
*filter

# allow all connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# allow all OUTPUT
-A OUTPUT -j ACCEPT

# HTTPS http 
-A INPUT -p tcp --dport 443 -j ACCEPT
-A INPUT -p tcp --dport 80 -j ACCEPT

# login
-A INPUT -p tcp -m state --state NEW --dport 38888 -j ACCEPT

# ping
-A INPUT -p icmp --icmp-type 8 -j ACCEPT

# log denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied:" --log-level 7

# 
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --set

# 1min 150 
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 150 -j DROP

# other
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
```

```
告诉服务器iptables规则在哪
sudo iptables-restore < /etc/iptables.up.rules

查看状态
sudo ufw status

激活状态
sudo ufw enable

关闭状态
sudo ufw disable

设置脚本文件开机后自动启动
sudo vi /etc/network/if-up.d/iptables
```

```
#!/bin/sh

iptables-restore /etc/iptables.up.rules
```

```
设置权限
sudo chmod +x /etc/network/if-up.d/iptables
```

### 配置Fail2ban

```
安装
sudo apt-get install fail2ban

打开配置文件
sudo vi /etc/fail2ban/jail.conf
```

```
修改为：
bantime = 3600
destmail = qq.com
```

```
查看运行状态
sudo service fail2ban status

开关
sudo service fail2ban stop
sudo service fail2ban start
```
