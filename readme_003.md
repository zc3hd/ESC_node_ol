### 安装git
```
sudo apt-get install git
```

### 安装NVM 
```
【下载】
git clone git://github.com/creationix/nvm.git ~/.nvm

【激活nvm命令】
source ~/.nvm/nvm.sh
```

### 将NVM配置到环境变量

```
sudo vi .bashrc
------------------------------------------
source ~/.nvm/nvm.sh 【添加到文件的最后一行】
------------------------------------------
source .bashrc 【重新载入环境变量】
```

### 安装node
```
nvm install v6.9.5

nvm use v6.9.5
nvm alias default v6.9.5

node -v
```

### 升级NPM
```
npm  --registry=https://registry.npm.taobao.org install -g npm
```

### 安装nrm
```
全局安装
npm  --registry=https://registry.npm.taobao.org install -g nrm
```
