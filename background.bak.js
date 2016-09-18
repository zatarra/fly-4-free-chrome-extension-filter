/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/

 // Initialize cache for the first time.
if (!localStorage.url) {
  localStorage.keywords = "";
  localStorage.url = "https://www.fly4free.com/feed/";
  localStorage.links = JSON.stringify([]);
  console.log("Initializing Cache...");
}



function getRSS(){
  notifications_to_show = 3;
  //var searchURL = "https://www.fly4free.com/feed/";
  links = JSON.parse(localStorage.links);  
  searchURL = localStorage.url;
  var keywords = localStorage.keywords.split(",").map(function(x){ return x.toUpperCase().trim() });

  var x = new XMLHttpRequest();
  x.open('GET', searchURL);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'text';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response){
      errorCallback('Invalid response...');
      return;
    }
    var items = /<item>([\s\S]*?)<\/item>/img;
    var details_title = /<title>([\s\S]*?)<\/title>/im;
    var details_link  = /<link>([\s\S]*?)<\/link>/im;
    var details_date  = /<pubDate>([\s\S]*?)<\/pubDate>/im;
    var title_parser  = /(\w+)/img

    while ( result = items.exec(response) ) {
      // Iterate over the existing offer, save data to a local database and match it against user's preferences. 
      var title = details_title.exec(result[1].trim());
      var link  = details_link.exec(result[1].trim());
      var date  = details_date.exec(result[1].trim());

      if ( links.indexOf(link[1]) > -1  ){
        // Found an already kown  entry. Since they're sorted by date, it means that all the other entries are older ( aka parsed already ).
        console.log("Found the last known entry ...");
        break;
      }
      links.push(link[1]);
      // Keep only the latest 20 items..
      if ( links.length > 20 )
        links.shift();

      localStorage.links = JSON.stringify(links);

      // Search matching keyword
      title_words = [];
      while ( t = title_parser.exec(title[1]) ){
        title_words.push(t[1]);
      }

      if ( matchKeyword(title_words, keywords) ) {
        if ( notifications_to_show == 0 )
          continue;
        notifications_to_show--;

        new Notification(title[1], {
          icon: '128.png',
          body: link[1]
        }).onclick = function(e){window.open(e.srcElement.body)};
        chrome.browserAction.setIcon({
            path: '128.png'
        });

      }
      
    }
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();

}


function matchKeyword(needle, haystack){
    var n = "";
    for ( var i = 0; i < needle.length; i++ ) {
      n = needle[i].toUpperCase();
      if ( haystack.indexOf(n) > -1  || (haystack.length == 1 && haystack[0] == "") ){
        return true;
      }
    }
    return false;
}

function errorCallback(msg){
  console.log(msg);
}

// Test for notification support.
if (window.Notification) {
  getRSS(); 

  setInterval(function() {
      getRSS();
  }, 10000);
}
