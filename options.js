/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/

window.addEventListener('load', function() {
  // Initialize the option controls.

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

  options.keywords.onchange = function(){
    localStorage.keywords = options.keywords.value;
  }

});
