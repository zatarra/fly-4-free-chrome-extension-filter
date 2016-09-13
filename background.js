/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/
localStorage.links = JSON.stringify([]);
localStorage.results = JSON.stringify([]);

 // Initialize cache for the first time.
if (!localStorage.url) {
  localStorage.keywords = "";
  localStorage.url = "https://www.fly4free.com/feed/";
  localStorage.links = JSON.stringify([]);
  localStorage.results = JSON.stringify([]);
  console.log("Initializing Cache...");
}



function getRSS(){
  notifications_to_show = 3;
  //var searchURL = "https://www.fly4free.com/feed/";
  links = JSON.parse(localStorage.links);  
  searchURL = localStorage.url;
  var keywords = localStorage.keywords.split(",").map(function(x){ return x.toUpperCase().trim() });
  var results = JSON.parse(localStorage.results);

  var x = new XMLHttpRequest();
  x.open('GET', searchURL);
  x.responseType = 'text';
  x.onload = function() {
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
      
      title_words = [];
      while ( t = title_parser.exec(title[1]) ){
        title_words.push(t[1]);
      }
      

      if ( matchKeyword(title_words, keywords) ) {
       console.log("WE HAVE A MATCH: " + title_words );
       // We have a match, let's check if the link is new deal.
        if ( links.indexOf(link[1]) == -1  ){
          links.push(link[1]);
          results.push({"title": title[1], "link": link[1], "date": date[1]}); 
          //Yup! New deal! Notify the user... Notifications are limited to three in a row to avoid spamming the user.
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
        }else {console.log("DEAL ALREADY HANDLED...");}
      
      }    
      
    }
    while ( links.length > 20 )
      links.shift();
    while ( results.length > 20 )
      results.shift();

    localStorage.links   = JSON.stringify(links);
    localStorage.results = JSON.stringify(results);
    console.log("Finished loading " + results.length + " deals.");

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
  }, 300000);
}
