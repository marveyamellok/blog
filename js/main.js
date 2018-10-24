$(function() {
  // var data;
  $.getJSON('data/data.json', function(_data){
    // data = _data;
    // var adapter = new FileSync('data.json')
    var adapter = new LocalStorage('data');
    var data = low(adapter);

    data.defaults({ posts: [], user: {login:"MarveyaMellok", password: "123"}, count: 0, greet: {title: "Welcome to this blog", color: "green", visible: true} })
      .write();

    $(window).trigger( "main:ready", data );

  });


});