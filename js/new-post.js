$(function() {
  var data;
  $(window).on( "main:ready", function(e, _data){
    var content = [];
    var $likesButton;
    var $deleteButton;
    var $openButton;
    var $closeButton;
    var $element = $(".box");
    var count = 0;

    data = _data;

    // data.get('posts').remove({}).write();

    if (data.__wrapped__.posts != 0){
      var dataContent = data.__wrapped__.posts;
      for (var i = 0; i < dataContent.length; i++){
        createPosts(dataContent[i].title, dataContent[i].subtitle, dataContent[i].text, dataContent[i].date, dataContent[i].likes, dataContent[i].num);
      }
    }

    var countLikes = 0;

    if($(".post__delete") == undefined){
      $deleteButton = [];
      $likesButton = [];
      $openButton = [];
      $closeButton = [];
    } else {
      $deleteButton = $(".post__delete");
      $likesButton = $(".post__icon.post__likes");
      $openButton = $(".openFullButton");
      $closeButton = $(".closeFullButton");
      deletePost($deleteButton);
      like($likesButton);
      openPost($openButton);
      closePost($closeButton);
    }

    $(".new-post__publ-btn").on("click", function(){

      Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth()+1).toString();
        var dd  = this.getDate().toString();
        var hours = this.getHours().toString();
        var minutes = this.getMinutes().toString();
        if (Number(minutes) < 10){
          minutes = "0" + minutes;
        }
        if (Number(hours) < 10){
          hours = "0" + hours;
        }
        return ( dd[1] ? dd : "0" + dd[0] ) + "." + ( mm[1] ? mm : "0" + mm[0] ) + "." + yyyy + ", " + hours  + ":" + minutes; 
      };

      var date = new Date();


      var newTitle = $(".new-post__title").val();
      var newSubtitle = $(".new-post__subtitle").val();
      var newText = $(".new-post__text").val();
      var newDate = date.yyyymmdd();
      var newNum;
      var dataArr = data.__wrapped__.posts;

      if (newTitle == "") return;


      if (dataArr.length !== 0){
        newNum = dataArr[dataArr.length - 1].num + 1;
      } else {
        newNum = 1;
      }

      var context = {
        num: newNum,
        title: newTitle,
        subtitle: newSubtitle,
        text: newText, 
        date: newDate, 
        likes: countLikes 
      };

      content.push(context);

      data.get('posts')
        .push(context)
        .write()

      var j = content.length - 1;

      createPosts(content[j].title, content[j].subtitle, content[j].text, content[j].date, content[j].likes, content[j].num)
      $likesButton = $(".post__icon.post__likes");
      $deleteButton = $(".post__delete");
      $openButton = $(".openFullButton");
      $closeButton = $(".closeFullButton");
      console.log($openButton, $closeButton);
      countLikes++;
      $(window).trigger( "post:like", $likesButton);
      $(window).trigger( "post:delete", $deleteButton);

      $(window).trigger( "post:open", $openButton);
      $(window).trigger( "post:close", $closeButton);

    });

    $(".new-post__picture").on("click", function(){
      var writeEarly = $(".new-post__text").val();
      var image = writeEarly + '<br><img class="image featured" src="' + $(".new-post__pic-arrd").val() + '""><br>';
      $(".new-post__text").val(image);
    })


    //////////////////////////////////при срабатывании события///////////////////////////////////////////////////////////////////

    $(window).on( "post:like", function( e, newButtons ){
      like(newButtons);
    });

    $(window).on( "post:open", function( e, openButtons ){
      openPost(openButtons);
    });

    $(window).on( "post:close", function( e, closeButtons ){
      closePost(closeButtons);
    });

    $(window).on( "post:delete", function( e, deleteButtons ){
      deletePost(deleteButtons);
    });


    //////////////////////////////////переиспользуемые функции///////////////////////////////////////////////////////////////////

    function deletePost(deleteBtn){
      $(deleteBtn).on("click", function(){
        var arr = $(".inner.inner__content").children();
        var parent = $(this).parent();
        var parentNum = $(".post__number", parent).html();

        for (var i = 0; i < arr.length; i++){
          var arrNum = $(".post__number", arr[i]).html();

          if ( arrNum == parentNum){
            var array = data.__wrapped__.posts;
            data.__wrapped__.posts.splice((array.length - i - 1), 1);
            data.get('posts').remove({num: (i - 1)}).write();
          } 
        }
        
        $(parent).remove();
      })
    }

    function openPost(open){
      $(open).on("click", function(){
        var parent = $(this).parent();
        var thisClose = $(parent).find(".closeFullButton")
        var $tBlock = $(".post__text", parent);
        var height = $(".post__text-content", parent).css( "height");
        $tBlock.css({"maxHeight":"none", "height": height});
        $(this).css({"opacity":"0", "pointerEvents":"none"});
        $(thisClose).css({"opacity" : "1", "pointerEvents" : "all"});
      }) 
    }

    function closePost(close){
      $(close).on("click", function(){
        var parent = $(this).parent();
        var thisOpen = $(parent).find(".openFullButton");
        var $tBlock = $(".post__text", parent);
        $tBlock.css({"height": "auto;", "maxHeight":"400px"});
        $(this).css({"opacity":"0", "pointerEvents":"none"});
        $(thisOpen).css({"opacity" : "1", "pointerEvents" : "all"});
      })  
    }


    function like(newButtons){
      $(newButtons).on("click", function(event){
        event.preventDefault()
        $(this).html(Number($(this).html()) + 1);
        content.likes = Number($(this).html()) + 1;
      })
    }

    function createPosts(title, subtitle, text, date, likes, num){
      var newPost = $('<article class="box post post-excerpt"><div class="post__number">' + num + '</div><div class="post__delete">Delete</div><header><h2><a href="' + title +'" class="post__title">' + title + '</a></h2><p class="post__subtitle">' + subtitle + '</p></header><div class="info"><span class="date">' + date + '</span><ul class="stats"><li><div class="post__icon post__comments">0</div></li><li><div class="post__icon post__likes">' + likes + '</div></li></ul></div><div class="post__text"><p class="post__text-content">' + text + '</p></div><div class="openFullButton">Open Full</div><div class="closeFullButton">Close Full</div></article>').prependTo(".inner.inner__content");
      var resentPost = $('<li><a href="' + title + '">' + title + '</a></li>').prependTo(".recentPosts");
    }

  });


})