var Tool = require('./tool.js');
var tool = new Tool();



var conf = {
  // IP登录端口
  login_port: 22,
  // 登录用户名
  user: "cc",
  // 公网IP
  ip: "47.94.202.107",
};

// 任务列表
var tasks = [
  // 
  {
    src: './files_to_ol/index.js',
    to: 'db_from_out/',
  },
  // 
  {
    src: './files_to_ol/package.json',
    to: '',
  },
  // 
  {
    src: './files_to_ol/tool.js',
    to: '',
  },
];

var one_task = null;


fn_cmd(0);

function fn_cmd(index) {
  if (index == tasks.length) {
    console.log('全部传输完成');
    return;
  }
  // 其中一个任务
  one_task = tasks[index];
  tool
    ._cmd(`scp -P ${conf.login_port} ${one_task.src} ${conf.user}@${conf.ip}:/home/${conf.user}/${one_task.to}`)
    .then(function() {
      console.log(one_task.src + '上传完成');
      index++;
      fn_cmd(index);
    })
}
