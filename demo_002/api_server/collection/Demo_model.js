var mongoose = require('mongoose');
// 集合标示
var model_key = 'demo';

// 文档模型
var doc_model = new mongoose.Schema({
  info: { type: String, unique: true },
});

// 模型
module.exports = mongoose.model(model_key, doc_model);
