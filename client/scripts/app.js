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
  app.mostRecent;
  app.currentRoom;
  app.rooms = [];

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
    if(escaper($("#message").val()) === ""){
      return;
    };
    console.log(true);
    app.send(msg);
    var user = JSON.stringify(escaper(msg.username)) || "";
    var message = JSON.stringify(escaper(msg.text)) || "";
    var createdAt = JSON.stringify(msg.createdAt) || "???";
    if (msg.roomname){
      var newLi = '<li class="message chat ' + msg.roomname + '">'+user+": "+message+"  "+createdAt+'</li>';
    } else {
      var newLi = '<li class="message chat">'+user+": "+message+"  "+createdAt+'</li>';
    }
    // console.log(data.results[i].roomname);
    // newDiv.class = data.results[i].roomname;
    $("#message").val("");
    // $("#chats").prepend(newLi);
    //add class roomname (newDiv.class = .roomname;?)
  }

  var showUserName = function(){
    $('h1').append("<h5>" + "Username : " + username + "</h5>");
  }

  $(document).ready( function() {
    showUserName();
    $("#send").on("click", function(){
      console.log("Button clicking")
      var message = escaper($("#message").val());
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
      data: {
        order: "-createdAt",
        // where:  where,
        limit: 100
      },
      success: function(d){
        // console.log(d);
        for(var i = 0; i < d.results.length; i++){
          if (app.rooms.indexOf(d.results[i].roomname) === -1) {
            app.rooms.push(d.results[i].roomname)
          }
        }
        console.log(app.rooms);
        app.mostRecent = d.results[0].createdAt || "2015-02-17T23:31:05.340Z";
        displayMessages(d)
      },
      dataType: "json"
    })
  };

  app.deliverNewMessages = function(){
    var where = JSON.stringify({createdAt: {$gt: app.mostRecent }, roomname: app.currentRoom});
    $.ajax({
      type: "GET",
      url: app.server,
      data: {
        order: "-createdAt",
        where:  where,
        limit: 1000
      },
      success: function(d){
        // console.log(app.mostRecent);
        // console.log(d.results);
        if (d.results.length === 0){
          console.log('before')
        return;}
        console.log('after');
        app.mostRecent = d.results[0]["createdAt"];
        // console.log(d);
        displayMessages(d);
      },
      dataType: "json"
    })
  };


  var displayMessages = function (data) {
    //showRooms(data);
    for(var i = 0; i<data.results.length; i++){
      var user = JSON.stringify(escaper(data.results[i].username)) || "";
      var message = JSON.stringify(escaper(data.results[i].text)) || "";
      var createdAt = JSON.stringify(data.results[i].createdAt) || "";
      if (data.results[i].roomname){
        var newDiv = '<li class="message chat ' + data.results[i].roomname + '">'+user+": "+message+"  "+createdAt+'</li>';
      } else {
        var newDiv = '<li class="message chat">'+user+": "+message+"  <span class='time'>"+createdAt+'</span></li>';
      }
      // console.log(data.results[i].roomname);
      newDiv.class = data.results[i].roomname;
      $("#chats").prepend(newDiv);
    }
    console.log('display message');
  }

  app.clearMessages = function(){
    $('#chats').empty();
  };

  app.showThisRoom = function(room){
    var room = escaper(room);
    console.log(room);
    var filterRoom = {order: "-createdAt", where: {roomname: room}};
    if (!room){return false;}

    $.ajax({
      type: "GET",
      url: "https://api.parse.com/1/classes/chatterbox",
      data: filterRoom,
      success: function(d){
        if(d.results.length === 0){
          alert("Sorry, this room doesn't exist :(");
        };
        console.log(app.currentRoom);
        app.currentRoom = room;
        console.log(app.currentRoom);
        app.clearMessages();
        displayMessages(d)
      },
      dataType: "json"
    })
  };

  setInterval(function(){
    // console.log('yay');
    app.deliverNewMessages();
  }, 1000);

// upon entering a new room, clear the previous set interval for retrieving new messages
// reset most recent value
// set up a new one for the new room

// var refreshIntervalId = setInterval(fname, 10000);
// clearInterval(refreshIntervalId);

  setInterval(function(){
    // console.log('woo post test');
    // send();
  }, 2500);

app.fetch();

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








