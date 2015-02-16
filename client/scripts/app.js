var temp = $.ajax({
  type: "GET",
  url: "https://api.parse.com/1/classes/chatterbox",
  success: function(data){
    var data = data;
    displayMessages(data)
  },
  dataType: "json"
});

var displayMessages = function (data) {
  console.log(data.results);
  for(var i = 0; i<data.results.length; i++){
    var user = data.results[i].username;
    var message = data.results[i].text;
    $("body").append('<div>'+user+": "+message+'</div>');
    console.log('working');
  }
}
