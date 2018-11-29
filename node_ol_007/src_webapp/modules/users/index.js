function App(argument) {
  var me = this;

  me.index = 0;

  // 
  me.find_max_index_key = true;
}
App.prototype = {
  init: function() {
    var me = this;
    me._bind();

    me.list();

    me.add();

    me.edit();

    me.del();

    me.bgc_change();
  },
  _bind: function() {
    var me = this;
    var fns = {
      bgc_change:function () {
        var bgc = null;
        setInterval(function () {
          bgc = Math.ceil(Math.random()*1000000);

          $('#add').css("backgroundColor","#"+bgc);
          $('#count').css("backgroundColor","#"+bgc);
        },1000);
      },
      add: function() {

        $('#add').on('click', function() {
          $.ajax({
              url: "/api/user/add.do",
              dataType: "json",
              type: "POST",
              data: {
                name: "name_" + me.index,
                info: "info_" + me.index,
              }
            })
            .done(function(data) {
              me.index++;
              me.list();
            });
        });
      },
      list: function() {
        $.ajax({
            url: "/api/user/list.do",
            dataType: "json",
            type: "POST",
          })
          .done(function(data) {

            // console.log('list')
            // console.log(data);
            // console.log('**************************')
            var str = '';
            $('#list').html(str);

            var title_arr = null;
            var max_index = 0;
            data.forEach(function(ele, index) {

              if (me.find_max_index_key) {
                title_arr = ele.name.split("_");
                title_arr[1] = title_arr[1] * 1
                if (title_arr[1] > max_index) {
                  max_index = title_arr[1];
                  me.index = max_index;
                  me.index++;
                }
                me.find_max_index_key = false;
              }

              str += `
              <div class="item">
                <span>${ele.name}</span>
                <span>${ele.info||"--"}</span>
                <span class="edit" _id=${ele._id}>edit</span>
                <span class="del" _id=${ele._id}>del</span>
              </div>
              `;
            });

            // console.log(me.index);
            $('#list').html(str);
          });

        $.ajax({
            url: "/api/user/count.do",
            dataType: "json",
            type: "POST",
          })
          .done(function(data) {

            // console.log(data);
            $('#count').html(`共 ${data.count} 条数据`);
          });
      },

      edit: function() {
        $('#list').on('click', '.edit', function(e) {

          $.ajax({
              url: "/api/user/edit.do",
              dataType: "json",
              type: "POST",
              data: {
                _id: $(e.currentTarget).attr('_id')
              }
            })
            .done(function(data) {
              // me.index++;
              me.find_max_index_key = true;
              me.list();
            });

        });
      },

      del: function() {
        $('#list').on('click', '.del', function(e) {

          $.ajax({
              url: "/api/user/del.do",
              dataType: "json",
              type: "POST",
              data: {
                _id: $(e.currentTarget).attr('_id')
              }
            })
            .done(function(data) {
              // me.index++;
              me.find_max_index_key = true;
              me.list();
            });

        });
      },
    };

    for (var key in fns) {
      me[key] = fns[key];
    }
  },
};

new App().init();
