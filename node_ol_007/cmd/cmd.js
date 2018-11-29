var process = require('child_process');
function cmd() {}
cmd.prototype._cmd = function(shell) {
  return new Promise(function(resolve, reject) {
    process.exec(shell, function(error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      console.log(stdout, stderr)
      resolve();
    });
  });
};

module.exports = cmd;
