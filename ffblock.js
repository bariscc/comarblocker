

var cards = document.getElementsByClassName('ProfileCard');
var arr = Array.from(cards);

chrome.extension.sendRequest(arr);