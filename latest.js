/*
  Fly4Free Notifications extension. Allows you to get browser notifications whenever Fly4Free posts a new specific deal that matches your request.
  Created by: David Gouveia
  Email: david [ . ] gouveia [ at ] gmail.com
  Web: https://www.davidgouveia.net
*/

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
  //var keywords = localStorage.keywords.split(",").map(function(x){ return x.toUpperCase().trim() });
  tableRef = document.getElementById('tblDeals');
  results = JSON.parse(localStorage.results);
  for ( var i = 0; i < results.length; i++ ) {
    addDeal("<a href='" + results[i].link  + "'>" + results[i].title  + "</a>", results[i].date, tableRef);
  }
}

function addDeal(name, date, tableRef){

  // Insert a row in the table at the last row 
  var newRow   = tableRef.insertRow(0);
  var cellName  = newRow.insertCell(0);
  cellName.innerHTML = name;

}

function errorCalback(msg){
  console.log(msg); 
}

