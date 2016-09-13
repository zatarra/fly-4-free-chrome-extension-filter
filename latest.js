/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/


window.addEventListener('load', function() {
  loadDeals();
  chrome.browserAction.setIcon({
    path: '128-off.png'
  });
});

window.addEventListener('click', function(e) {
  if ( "href" in e.srcElement )
    window.open(e.srcElement.href );
});

function loadDeals(){
  var deals = document.getElementById("deals");
  results = JSON.parse(localStorage.results);
  output = "";
  for ( var i = 0; i < results.length; i++ ) {
    output += "<p><a href='" + results[i].link  + "'>" + results[i].title  + "</a></p>";
  }
  deals.innerHTML = output;
}

function errorCalback(msg){
  console.log(msg); 
}

