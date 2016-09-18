/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/

window.addEventListener('click', function(e) {
  if ( e.srcElement.id == "clearcache" ){
    localStorage.links = JSON.stringify([]);
    localStorage.results = JSON.stringify([]);
    chrome.browserAction.setIcon({
      path: '128-off.png'
    });
    console.log("Local Cache cleared...");
  }
   
});

window.addEventListener('load', function() {
  // Initialize the option controls.

  options.listall.onchange = function() {

    if ( options.listall.checked )
      localStorage.listAll = "1";
    else
      localStorage.listAll = "0";

    console.log( "configured listall to " + localStorage.listAll );
  }

  options.location.onchange = function() {
    localStorage.url = options.location.value;
  }

  if ( localStorage.url != null )
  {
    options.location.value = localStorage.url;
  }

  if ( localStorage.keywords != null )
    options.keywords.value = localStorage.keywords;
  else
    options.keywords.value = "";

  if ( localStorage.listAll == "1" )
    options.listall.checked = true;
  else
    options.listall.checked =  false;

  console.log(localStorage.listall);
  options.keywords.onchange = function(){
    localStorage.keywords = options.keywords.value;
  }

});
