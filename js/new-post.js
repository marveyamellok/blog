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
        createPosts(dataContent[i].title, dataContent[i].subtitle, dataContent[i].text, dataContent[i].date, dataContent[i].likes, dataContent[i].num, dataContent[i].comments);
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
      makeComment()
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
        likes: countLikes, 
        comments: [] 
      };

      content.push(context);

      data.get('posts')
        .push(context)
        .write()

      var j = content.length - 1;

      createPosts(content[j].title, content[j].subtitle, content[j].text, content[j].date, content[j].likes, content[j].num, content[j].comments);

      $likesButton = $(".post__icon.post__likes");
      $deleteButton = $(".post__delete");
      $openButton = $(".openFullButton");
      $closeButton = $(".closeFullButton");
      countLikes++;
      $(window).trigger( "post:like", $likesButton);
      $(window).trigger( "post:delete", $deleteButton);

      $(window).trigger( "post:open", $openButton);
      $(window).trigger( "post:close", $closeButton);

      makeComment()
    });

    $(".new-post__picture").on("click", function(){
      var writeEarly = $(".new-post__text").val();
      var image = writeEarly + '<br><img class="image featured" src="' + $(".new-post__pic-arrd").val() + '""><br>';
      $(".new-post__text").val(image);
    });


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
        var $parent = $(this).parent();
        var thisClose = $($parent).find(".closeFullButton")
        var $tBlock = $(".post__text", $parent);
        var heightText = $(".post__text-content", $parent).height();
        var heightComments = $(".comments", $parent).height();
        var heightOpenBtn = $(".openFullButton", $parent).height();
        var height = heightText + heightComments + heightOpenBtn;
        $(".comments", $parent).show();
        $tBlock.css({"maxHeight":"none", "height": height});
        $(this).css({"opacity":"0", "pointerEvents":"none"});
        $(thisClose).css({"opacity" : "1", "pointerEvents" : "all"});
      }) 
    }

    function closePost(close){
      $(close).on("click", function(){
        var $parent = $(this).parent();
        var thisOpen = $($parent).find(".openFullButton");
        var $tBlock = $(".post__text", $parent);
        $tBlock.css({"height": "auto", "maxHeight":"400px"});
        $(this).css({"opacity":"0", "pointerEvents":"none"});
        $(thisOpen).css({"opacity" : "1", "pointerEvents" : "all"});
        $(".comments", $parent).hide();
      })  
    }


    function like(newButtons){
      $(newButtons).on("click", function(event){
        event.preventDefault()
        var parent = $(this).parent().parent().parent().parent();
        var number = $(".post__number", parent).html();
        var count = Number($(this).html()) + 1;
        var post = data.__wrapped__.posts[number - 1];

        var newNum = post.num;
        var newTitle = post.title;
        var newSubtitle = post.subtitle;
        var newText = post.text;
        var newDate = post.date;
        var countLikes = post.likes;

        data.__wrapped__.posts[number - 1].likes = count;
        data.get('posts')
            .find({num: newNum, title: newTitle, subtitle: newSubtitle, text: newText, date: newDate, likes: countLikes})
            .assign({num: newNum, title: newTitle, subtitle: newSubtitle, text: newText, date: newDate, likes: count})
            .write();
        $(this).html(count);
      })
    }

    function makeComment(){
      $(".sendComment").on("click", function(){
        var $parent = $(this).parent();
        var $mainParent = $(this).parent().parent().parent().parent();
        var $containter = $(".comments__block", $mainParent)
        var number = $(".post__number", $mainParent).html();
        var thisText = $(".createComment", $parent).val();

        if (thisText == "") return; 
        var newComment = $('<div class="comments__item">' + thisText + '<div class="deleteComment></div>').prependTo($containter);
        var thisHeight = $(newComment).outerHeight(true);
        var $postText = $(".post__text", $mainParent);
        var postHeight = $($postText).outerHeight(true);
        $($postText).css({"height": postHeight + thisHeight})
        console.log(thisHeight, postHeight)

        var com = {
          text: thisText
        };

        var post = data.__wrapped__.posts[number - 1].comments;
        var newNum = post.num;
        var newTitle = post.title;
        var newSubtitle = post.subtitle;
        var newText = post.text;
        var newDate = post.date;
        var countLikes = post.likes;
        var newComments = post.comments;

        var arr = data.__wrapped__.posts[number - 1].comments;
        arr.push(com);

        data.get('posts')
          .find({num: newNum, title: newTitle, subtitle: newSubtitle, text: newText, date: newDate, likes: countLikes, comments: newComments})
          .assign({num: newNum, title: newTitle, subtitle: newSubtitle, text: newText, date: newDate, likes: countLikes, comments: com})
          .write()

        $($(".createComment", $parent)).val("")
      })
    }

    function createPosts(title, subtitle, text, date, likes, num, comments){
      var comms = "";

      for (var i = 0; i < comments.length; i++){
        var j  = comments.length - i - 1;
        var newComm = '<div class="comments__item">' + comments[j].text + '</div>';
        comms += newComm;
      }

      var newPost = $('<article class="box post post-excerpt"><div class="post__number">' + num + '</div><div class="post__delete">Delete</div><header><h2><a href="' + title +'" class="post__title">' + title + '</a></h2><p class="post__subtitle">' + subtitle + '</p></header><div class="info"><span class="date">' + date + '</span><ul class="stats"><li><div class="post__icon post__comments">0</div></li><li><div class="post__icon post__likes">' + likes + '</div></li></ul></div><div class="post__text"><p class="post__text-content">' + text + '</p><div class="comments"><div class="comments__text">Comments</div><div class="comments__block">' + comms + '</div><div class="comment__new"><div class="comments__text">Leave a comment</div><textarea class="createComment"></textarea><button class="sendComment">Send</button></div></div></div><div class="openFullButton">Open Full</div><div class="closeFullButton">Close Full</div></article>').prependTo(".inner.inner__content");
      var resentPost = $('<li><a href="' + title + '">' + title + '</a></li>').prependTo(".recentPosts");
      
    }

  });


})