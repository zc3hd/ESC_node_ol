var mongoose = require('mongoose');
// 集合标示
var model_key = 'book';

// 文档模型
var doc_model = new mongoose.Schema({
  title: String,
  body: String,
  // 
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  // 标签
  labels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'label'
  }],

});

// 模型
module.exports = mongoose.model(model_key, doc_model);
