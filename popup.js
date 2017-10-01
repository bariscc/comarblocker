// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */


function renderStatus(status) {
  if(status == true) {
    document.getElementById('wrapper').className = "active";
  }
  else {
    document.getElementById('wrapper').className = "";
  }
}

function renderCount(count) {
  document.getElementById('count').innerHTML = count;  
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Check url.
    if(url) {
      var pattern = new RegExp('http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/(followers|following)$');
      if(pattern.test(url)){
        renderStatus(true);
        chrome.tabs.executeScript(null, { 
          file: "jquery.slim.min.js"
        }, function() {
          chrome.tabs.executeScript(null, { file: "ffcount.js" });
        });
      }
      else {
        renderStatus(false);
      }
    }

  });

  var blockButton = document.getElementById('blockButton');
  blockButton.addEventListener("click", function() {
    var followerFlag = document.getElementById("followerFlag").checked;
    console.log(followerFlag);
    // alert("blokla!");
    chrome.tabs.executeScript(null, { 
      file: "jquery.slim.min.js"
    }, function() {
        chrome.tabs.executeScript(null, { 
          code: 'var followerFlag = '+followerFlag+';'
        }, function() {
          chrome.tabs.executeScript(null, { file: "ffblock.js" });
        });
    });
  }, false);

  var loadButton = document.getElementById('loadButton');
  loadButton.addEventListener("click", function() {
    chrome.tabs.executeScript(null, { 
      file: "jquery.slim.min.js"
    }, function() {
      chrome.tabs.executeScript(null, { file: "ffload.js" });
    });
  }, false); 

});

chrome.extension.onRequest.addListener(function(arr,sender,sendResponse) {
  renderCount(arr[0].count);
});

