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

var messageGetter = function(){
  $.ajax({
    type: "GET",
    url: "https://api.parse.com/1/classes/chatterbox",
    data: "order=-createdAt",
    success: function(d){
      var d = d;
      displayMessages(d)
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
      var newDiv = '<div class="message ' + data.results[i].roomname + '">'+user+": "+message+'</div>';
    } else {
      var newDiv = '<div class="message">'+user+": "+message+'</div>';
    }
    console.log(data.results[i].roomname);
    newDiv.class = data.results[i].roomname;
    $(".container").prepend(newDiv);
  }
}

// var userName = escaper(prompt("What is your user name?"));

// var showUserName = function(){
//   $('h1').append("<h5>" + "Username : " + userName + "</h5>");
// }

setInterval(function(){
  // console.log('yay');
  messageGetter();
}, 2500);

// store the id of last message on our page
// periodically make ajax request
  // in data object, find index of last messages of our page
  // if it's not the index of length - 1, then we need to add new messages
  // call display message on the index of the last messages + 1 until the newest message
  // store the id of the newest message
var postTest = function(msg){
  $.post("https://api.parse.com/1/classes/chatterbox", JSON.stringify(msg),
    function(data){
      console.log("Message posted");
    },
    "json");
};

setInterval(function(){
  // console.log('woo post test');
  postTest;
}, 2500);

$(document).ready( function() {
//  showUserName();
  $("#submission").on("click", function(){
    console.log("Button clicking")
    var message = escaper($("#messageField").val());
    var messageObj = {text: message, userName: userName}
    postTest(messageObj);
  });
});

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








