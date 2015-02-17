var app = {};

app.init = function(){

  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  };

  var escaper = function(str){
    if (str === undefined || str === null || typeof str === 'boolean' || typeof str === 'function'){return "";}
    var x = escapeRegExp(str);
    return escapeHtml(x);
  };

  var username = escaper(prompt("What is your user name?"));

  // app.send = function(msg){
  //   $.post("https://api.parse.com/1/classes/chatterbox", JSON.stringify(msg),
  //     function(data){
  //       console.log("Message posted");
  //     },
  //     "json");
  // };
  app.server = "https://api.parse.com/1/classes/chatterbox";
  app.mostRecentId;

  app.send = function(msg){
    $.ajax({
      url: app.server,
      type: "POST",
      success: function(data){
        console.log("Message posted");
      },
      data: JSON.stringify(msg),
      dataType: "json"
    })
  };

  app.addMessage = function(msg){
    app.send(msg);
    var newDiv = '<div class="message">'+msg[username]+": "+msg["text"]+'</div>';
    //add class roomname (newDiv.class = .roomname;?)
    $("#chats").prepend(newDiv);

  }

  var showUserName = function(){
    $('h1').append("<h5>" + "Username : " + username + "</h5>");
  }

  $(document).ready( function() {
    showUserName();
    $("#submission").on("click", function(){
      console.log("Button clicking")
      var message = escaper($("#messageField").val());
      var messageObj = {text: message, username: username}
      app.addMessage(messageObj);
    });
    $("#clearMessages").on("click", function(){
      app.clearMessages();
    })
  });

  app.fetch = function(){
    $.ajax({
      type: "GET",
      url: app.server,
      data: "order=-createdAt",
      success: function(d){
        // console.log(d);
        app.mostRecentId = d.results[0].objectId;
        var d = d;
        displayMessages(d)
        console.log(app.mostRecentId);
      },
      dataType: "json"
    })
  };

  app.checkForNewMessages = function(){
    // store previous newest id (object[objectId]);
    // make an ajax request "GET"
    // if the most recent message on the server matches our most recent message
      // we don't need to do anything
   // otherwise, splice the array from the index of the previous newest object to the end of the array
   // call display messages on that new array or messages
    $.ajax({
      type: "GET",
      url: app.server,
      data: {
        order: "-createdAt",
        limit: 1
      },
      success: function(d){
        if(!d.results[0].objectId === app.mostRecentId){
          // get new messages on the server and display them
        }
      },
      dataType: "json"
    })
  };


  var displayMessages = function (data) {
    // console.log(data.results);
    showRooms(data);
    for(var i = 0; i<data.results.length; i++){
      var user = JSON.stringify(escaper(data.results[i].username)) || "";
      var message = JSON.stringify(escaper(data.results[i].text)) || "";
      if (data.results[i].roomname){
        var newDiv = '<div class="message chat ' + data.results[i].roomname + '">'+user+": "+message+'</div>';
      } else {
        var newDiv = '<div class="message chat">'+user+": "+message+'</div>';
      }
      // console.log(data.results[i].roomname);
      newDiv.class = data.results[i].roomname;
      $("#chats").prepend(newDiv);
    }
  }

  app.clearMessages = function(){
    $('#chats').empty();
  };

  setInterval(function(){
    // console.log('yay');
    app.fetch();
  }, 2500);


  setInterval(function(){
    // console.log('woo post test');
    // send();
  }, 2500);

};

// store the id of last message on our page
// periodically make ajax request
  // in data object, find index of last messages of our page
  // if it's not the index of length - 1, then we need to add new messages
  // call display message on the index of the last messages + 1 until the newest message
  // store the id of the newest message


var showRooms = function(data){
  var obj = {};
  for(var i = 0; i < data.results.length; i++){
    if(data.results[i]["roomname"]){
      obj[data.results[i].roomname] = data.results[i].roomname;
    }
  }
  for(var key in obj){
    //console.log(key);
  }
}

var showThisRoom = function(room){
  var room = escaper(room);

  // debugger;
  //var filterRoom = JSON.stringify(where={"roomname": '"' + room + '"'});
  var filterRoom = "where="+ JSON.stringify(where={roomname: room }) + ",order=-createdAt";
  if (!room){return false;}

  $.ajax({
    type: "GET",
    url: "https://api.parse.com/1/classes/chatterbox",
    data: filterRoom,
    success: function(d){
      var d = d;
      displayMessages(d)
      console.log(d);
    },
    dataType: "json"
  })
};



app.init()



// $.ajax({
//     type: "GET",
//     url: "https://api.parse.com/1/classes/chatterbox",
//     data: 'where={"roomname":"4chan"}',
// "where={"roomname":"4chan"}"
// 'where={"roomname":"4chan"}'
//     success: function(d){
//       var d = d;
//       displayMessages(d)
//     },
//     dataType: "json"
//   })








