function App(argument) {
  var me = this;

}
App.prototype = {
  init: function() {
    var me = this;
    me.nav_data = [
      // 
      {
        name: 'Books',
        src: '../../modules/books/index.html',
      },
      // 
      {
        name: 'base/users',
        src: '../../modules/users/index.html',
      },
      // 
      {
        name: 'base/labels',
        src: '../../modules/labels/index.html',
      },


    ];

    me._bind();
    me._nav();

  },
  _bind: function() {
    var me = this;
    var fns = {
      _nav:function () {
        var str = '';
        me.nav_data.forEach( function(ele, index) {
          str +=`
          <div class="item ${(index==0?"ac":"")}" _src=${ele.src}>${ele.name}</div>
          `;
        });
        $('#nav').html(str);

        $('#box>iframe').attr('src',me.nav_data[0].src);

        $('#nav').on('click','.item',function  (e) {
          $('#nav>.item').removeClass('ac');
          $(e.currentTarget).addClass('ac');


          // console.log($(e.currentTarget).attr('_src'));

          $('#box>iframe').attr('src',$(e.currentTarget).attr('_src'));
        });
      },
    };

    for (var key in fns) {
      me[key] = fns[key];
    }
  },
};

new App().init();
