/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/

 // Initializing settings for the first time.
if (!localStorage.url) {
  localStorage.keywords = "";
  localStorage.url = "https://www.fly4free.com/feed/";
  localStorage.links = JSON.stringify([]);
  localStorage.results = JSON.stringify([]);
  console.log("Initializing Cache...");
}

function purgeCache(links, results) {
  //console.log("amount of links: " + links.length );

  while ( links.length > 30 ){
    links.shift();
  }

  while ( results.length > 20 ){
    results.shift();
  }

  localStorage.links = JSON.stringify(links);
  localStorage.results = JSON.stringify(results);
}

function getRSS(){
  var notifications_to_show = 3;
  var links                 = JSON.parse(localStorage.links);  
  var keywords              = localStorage.keywords.split(",").map(function(x){ return x.toUpperCase().trim() });
  var searchURL             = localStorage.url;
  var results               = JSON.parse(localStorage.results);
  console.log("Booting up with " + links.length + " link(s) and " + results.length + " deals.");

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
//    console.log("Keywords I'm looking for: " + keywords );
//    console.log("URL: " + searchURL);

    while ( result = items.exec(response) ) {
      // Iterate over the existing offer, save data to a local database and match it against user's preferences. 
      var title = details_title.exec(result[1].trim());
      var link  = details_link.exec(result[1].trim());
      var date  = details_date.exec(result[1].trim());
//      console.log("Processing: " + link[1]);

      // Create a list of tokens      
      title_words = [];
      while ( t = title_parser.exec(title[1]) ){
        title_words.push(t[1]);
      }
//      console.log("Title tokens: " + title_words);
     
      // Match our keywords against the extracted tokens.
      if ( matchKeyword(title_words, keywords) ) {
//        console.log("MATCHED");
        // We have a match, let's check if the link is new deal.
        if ( links.indexOf(link[1]) == -1  ){
          links.push(link[1]);
          results.push({"title": title[1], "link": link[1], "date": date[1]}); 
          //Yup! New deal! Notify the user... Notifications are limited to three in a row to avoid spamming the user.
          if ( notifications_to_show == 0 ){
            console.log("Ignoring next notifications during current iteration...");
            continue;
          }
          notifications_to_show--;
          showNotification(title[1], link[1]);
        }
      }
//      console.log("*************************************************");    
    }
    purgeCache(links, results);
    console.log("Finished loading " + results.length + " deals of which " + links.length + " were stored");

  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();

}

function showNotification(title, link){
  new Notification(title, {
    icon: '128.png',
    body: link
  }).onclick = function(e){window.open(e.srcElement.body)};

  chrome.browserAction.setIcon({
    path: '128.png'
  });

}

function matchKeyword(needle, haystack){
    if ( localStorage.listAll == "1" ) return true;
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


//Check for Notifications support and start the loop.
if (window.Notification) {
  getRSS(); 

  setInterval(function() {
      getRSS();
  }, 300000);
}
