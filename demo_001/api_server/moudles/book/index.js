function JS_demo(app) {
  var me = this;
  
  // 
  me.app = app;
  // 路由
  me.router = require('express').Router();


  // 模型
  me.Book_model = require('../../collection/book_model.js');
  me.User_model = require('../../collection/user_model.js');
  me.Label_model = require('../../collection/label_model.js');
}
JS_demo.prototype = {
  init: function() {
    var me = this;

    // add
    me.router.post('/add.do', function(req, res) {
      me._api_add(req, res);
    });

    // list
    me.router.post('/list.do', function(req, res) {
      me._api_list(req, res);
    });

    // edit
    me.router.post('/edit.do', function(req, res) {
      me._api_edit(req, res);
    });

    // del
    me.router.post('/del.do', function(req, res) {
      me._api_del(req, res);
    });

    // del
    me.router.post('/count.do', function(req, res) {
      me._api_count(req, res);
    });


    me.app.use('/api/book',me.router);
  },
  _api_count: function(req, res) {
    var me = this;
    // me.data
    //   .count("json_arr")
    //   .then(function(result) {
    //     // 不能直接传数字
    //     res.send(result);
    //   });

    me.Book_model
      // 查询条件
      // .where({ 'color': 'black' })
      .countDocuments()
      .then(function(count) {
        // 不能直接传数字
        res.send({ count: count });
      });
  },


  _api_del: function(req, res) {
    var me = this;
    // me.data
    //   .del("json_arr", req.body)
    //   .then(function(result) {
    //     res.send(result);
    //   });
    // console.log(req.body);

    me.Book_model

    // 写的有这个函数，但是提示却没有。
      .deleteOne(req.body)
      .then(function(result) {
        res.send({});
      });
    // console.log(me.Book_model);





  },
  _api_edit: function(req, res) {
    var me = this;
    // var obj_id = {
    //   _id: req.body._id,
    // };
    // var obj = {
    //   name: "edit_name_" + Math.floor(Math.random() * 100),
    //   info: "edit_age_" + Math.floor(Math.random() * 100),
    // }
    // me.data
    //   .edit("json_arr", obj_id, obj)
    //   .then(function(result) {
    //     // console.log(result);
    //     res.send(result);
    //   });

    me.Book_model
      .findById(req.body._id)
      // 和官方不一样啊，这里前面是doc
      .then(function(doc, err) {

        var title_arr = doc.title.split("_");
        title_arr[1] = title_arr[1] * 1 + 1;
        doc.title = title_arr.join("_");

        // 实例方法也是promise
        doc.save()
          .then(function(result) {
            res.send(result);
          })

      });

    // Student.update({ "sid": sid }, req.query, function() {
    //   res.send("修改成功");
    // });

  },

  _api_add: function(req, res) {
    var me = this;


    // me.data
    //   .add("json_arr", {
    //     name: req.body.name,
    //     info: req.body.age,
    //   })
    //   .then(function(result) {
    //     // console.log(result);
    //     res.send(result);
    //   });

    me.User_model
      .find()
      .then(function(result) {
        // 随机选2个人
        var sel_index_1 = Math.floor(Math.random() * result.length / 2) + 0;
        var sel_index_2 = Math.floor(Math.random() * result.length / 2) + Math.floor(result.length / 2);
        var user_1_id = result[sel_index_1]._id;
        var user_2_id = result[sel_index_2]._id;

        // 附加选择两个人
        req.body.users = [user_1_id, user_2_id];


        // 
        return me.Label_model.find();

      })
      .then(function(result) {
        // 随机选2个人
        var sel_index_1 = Math.floor(Math.random() * result.length / 2) + 0;
        var sel_index_2 = Math.floor(Math.random() * result.length / 2) + Math.floor(result.length / 2);
        var label_1_id = result[sel_index_1]._id;
        var label_2_id = result[sel_index_2]._id;

        // 附加选择两个人
        req.body.labels = [label_1_id, label_2_id];

        return me.Book_model.create(req.body);
      })
      .then(function(result) {
        res.send(result);
      });


  },

  // 查找所有数据
  _api_list: function(req, res) {
    var me = this;
    // me.data
    //   .list("json_arr", {})
    //   .then(function(result) {
    //     res.send(result);
    //   });
    me.Book_model
      .find()
      .populate({
        // 指定查询哪个字段进行了关联
        path: "users",
        // 选择被关联集合的文档的属性
        select: 'name',
        // 
        // match: { name: 'name_1' },
        // 被查的数据中，指定哪个字段的排列方式
        options: { sort: { name: 1 } }
      })
      .populate({
        // 指定查询哪个字段进行了关联
        path: "labels",
        // 选择被关联集合的文档的属性
        select: 'label',
        // 
        // match: { name: 'name_1' },
        // 被查的数据中，指定哪个字段的排列方式
        // options: { sort: { label: 1 } }
      })
      .sort({ "_id": -1 })
      .then(function(result) {
        res.send(result);
      });
  },

};



module.exports = JS_demo;
