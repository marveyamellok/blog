$(function() {
  var data;
  $(window).on( "main:ready", function(e, _data){
    data = _data;

    var $editGreat = $(".greeting__editing");
    var $editGreatButton = $(".greeting__button");
    var $input = $(".greeting__editing-input");
    var $inputVisible = $("#greetVisible");
    var $color = $(".greeting__editing-color");
    var $textBlock = $(".greeting__text"); 

    var dataText = data.__wrapped__.greet.title;
    var dataColor = data.__wrapped__.greet.color;
    var dataVisible = data.__wrapped__.greet.visible;

    $($textBlock).html(dataText);
    $($textBlock).css({"color":dataColor});

    $(".greeting__editing-save").on("click", function(){
      var newGreeting = $($input).val();
      var newColor = $($color).val();
      var newVisible = $($inputVisible).prop( "checked" );

      if (newGreeting == ""){
        newGreeting = dataText;
      };

      if (newColor == ""){
        newColor = dataColor;
      };

      $($textBlock).html(newGreeting);
      $($textBlock).css({"color":newColor});

      data.__wrapped__.greet = { title: newGreeting, color: newColor, visible: newVisible};
      data.get('__wrapped__').find({ greet:{ title: dataText, color: dataColor, visible: dataVisible}}).assign({ greet:{ title: newGreeting, color: newColor, visible: newVisible}}).write();
    })

  })

})