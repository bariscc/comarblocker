
count();

// document.addEventListener("scroll", function() {
//   count();
// });

function count() {
  var cards = document.getElementsByClassName('ProfileCard');
  var arr = Array.from(cards);
  chrome.extension.sendRequest([{'count':arr.length}]);
}

/*$('.GridTimeline-items').bind("DOMNodeInserted",function(){
  count();
  alert('changed');
});*/

// select the target node
var target = document.getElementsByClassName('GridTimeline-items')[0];
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.type == "childList") {
      count();
    }
  });    
});
 
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };
 
// pass in the target node, as well as the observer options
observer.observe(target, config);
 
// later, you can stop observing
// observer.disconnect();