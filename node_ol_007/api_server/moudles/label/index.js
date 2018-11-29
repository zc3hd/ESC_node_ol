function JS_demo(app) {
  var me = this;
  me.app = app;
  me.Label_model = require('../../collection/label_model.js');
  // 测试模块
  me.Demo_model = require('../../collection/Demo_model.js');

  me.api_key = 'label';
}
JS_demo.prototype = {
  init: function() {
    var me = this;

    // add
    me.app.post('/api/label/add.do', function(req, res) {
      me._api_add(req, res);
    });

    // list
    me.app.post('/api/label/list.do', function(req, res) {
      me._api_list(req, res);
    });

    // edit
    me.app.post('/api/label/edit.do', function(req, res) {
      me._api_edit(req, res);
    });

    // del
    me.app.post('/api/label/del.do', function(req, res) {
      me._api_del(req, res);
    });

    // del
    me.app.post('/api/label/count.do', function(req, res) {
      me._api_count(req, res);
    });



  },
  _api_count: function(req, res) {
    var me = this;
    // me.data
    //   .count("json_arr")
    //   .then(function(result) {
    //     // 不能直接传数字
    //     res.send(result);
    //   });

    me.Label_model
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

    me.Label_model

    // 写的有这个函数，但是提示却没有。
      .deleteOne(req.body)
      .then(function(result) {
        res.send({});
      });
    // console.log(me.Label_model);





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

    me.Label_model
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

    me.Label_model
      .create(req.body)
      .then(function(result) {
        res.send(result);
      });


    // console.log(req.body);
    // me.Demo_model
    //   .create({ info: "a" })
    //   .then(function(result) {
    //     // console.log(result);
    //   });

    // me.Demo_model
    //   .on('index', function(err) {
    //     if (err) console.log(err);
    //   });




    // me.obj = {};
  },

  // 查找所有数据
  _api_list: function(req, res) {
    var me = this;
    // me.data
    //   .list("json_arr", {})
    //   .then(function(result) {
    //     res.send(result);
    //   });
    me.Label_model
      .find()
      .sort({ "_id": -1 })
      .then(function(result) {
        res.send(result);
      });
  },

};



module.exports = JS_demo;
