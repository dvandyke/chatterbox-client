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
  for(var i = 0; i<data.results.length; i++){
    var user = JSON.stringify(escaper(data.results[i].username)) || "";
    var message = JSON.stringify(escaper(data.results[i].text)) || "";
    $(".container").prepend('<div>'+user+": "+message+'</div>');
  }
}

setInterval(function(){console.log('yay'); messageGetter();}, 2500);

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

setInterval(function(){console.log('woo post test'); postTest;}, 2500);

$(document).ready( function() {
  $("#submission").on("click", function(){
    console.log("Button clicking")
    var message = escaper($("#messageField").val());
    var messageObj = {text: message, userName: "LongUserName"}
    postTest(messageObj);
  });
});
