$(function() {
  var data;
  $(window).on( "main:ready", function(e, _data){
    data = _data;
    var $element = $(".enter");
    var $enter = $(".enter__enter", $element);
    var $exit = $(".enter__exit", $element);

    var name = data.__wrapped__.user.login;
    var password = data.__wrapped__.user.password;

    var $login = $(".enter__input.enter__login", $element);
    var $password = $(".enter__input.enter__password", $element);
    var $btnEnter = $(".enter__button", $element);
    var $btnExit = $(".enter__exit-button", $element);

    var $editGreat = $(".greeting__editing");
    var $editGreatButton = $(".greeting__button");

    var $newPost = $(".new-post");

    var $greet = $(".greeting");

    if (data.__wrapped__.count == 1){
      logIn(name);
    } else {
      logOut();
    }

    $($btnEnter).on("click", function(){
      data.__wrapped__.count = 1;
      var userLogin = $($login).val();
      var userPassword = $($password).val();
      if ( userLogin == name && userPassword == password ){
        data.get('__wrapped__').find({ count: '0' }).assign({ count: '1'}).write();
        logIn(userLogin);
      } else {
        alert("Wrong password!")
      }
    });

    $($btnExit).on("click", function(){
      data.__wrapped__.count = 0;
      data.get('__wrapped__').find({ count: '1' }).assign({ count: '0'}).write();
      logOut();
    });

    function logIn(name){
      $($enter).css({"opacity": 0, "pointer-events":"none"});
      $($exit).css({"opacity": 1, "pointer-events":"all"});
      $($login).val("");
      $($password).val("");
      $(".enter__exit-name").html(name)
      $(".new-post").show();
      $($editGreatButton).show();
      $($greet).show();
      if ($(".post__delete")) $(".post__delete").show();
    };

    function logOut(){
      $($exit).css({"opacity": 0, "pointer-events":"none"});
      $($enter).css({"opacity": 1, "pointer-events":"all"});
      $(".new-post").hide();
      $($editGreatButton).hide();
      if ($(".post__delete")) $(".post__delete").hide();
      if (data.__wrapped__.greet.visible == false){
        $($greet).hide();
      }
    }
  });
});