var mongoose = require('mongoose');
// 集合标示
var model_key = 'user';

// 文档模型
var doc_model = new mongoose.Schema({
    name:  String,
    info:   String,
});

// 模型
module.exports = mongoose.model(model_key, doc_model);
