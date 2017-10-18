function getCurrentTabUrl(callback) {

  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });

}

function renderStatus(status) {
  if(status == true) {
    document.getElementById('wrapper').className = "active";
  } else {
    document.getElementById('wrapper').className = "";
  }
}

function renderCount(count,alreadyBlocked) {
  document.getElementById('count').innerHTML = count;
  document.getElementById('alreadyBlocked').innerHTML = alreadyBlocked;
}

document.addEventListener('DOMContentLoaded', function() {

  getCurrentTabUrl(function(url) {
    if(url) {
      var pattern = new RegExp('http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/(followers|following)$');
      if(pattern.test(url)){
        renderStatus(true);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "update"}, function(response) {});
        });
      }
      else {
        renderStatus(false);
      }
    }
  });

  var loadButton = document.getElementById('loadButton');
  var blockButton = document.getElementById('blockButton');
  var opStatus = document.getElementById('opStatus');

  loadButton.addEventListener("click", function() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

      if(loadButton.getAttribute("status") == "running") {
        
        chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, function(response) {          
          loadButton.innerHTML = "<i class='icon-play'></i> Yüklemeye Devam Et";
          loadButton.setAttribute("status", "stopped");
        });

      } else {

        chrome.tabs.sendMessage(tabs[0].id, {action: "start"}, function(response) {          
          loadButton.innerHTML = "<i class='icon-stop'></i> Yüklemeyi Durdur";
          loadButton.setAttribute("status", "running");
        });
      }

    });
  });

  blockButton.addEventListener("click", function() {

    var followerFlag = document.getElementById('followerFlag').checked;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
      if(loadButton.getAttribute("status") == "running") {
        
        chrome.tabs.sendMessage(tabs[0].id, {action: "stop"}, function(response) {          
          loadButton.innerHTML = "<i class='icon-play'></i> Yüklemeye Devam Et";
          loadButton.setAttribute("status", "stopped");
        });

      }

      chrome.tabs.sendMessage(tabs[0].id, {action: "block", followerFlag: followerFlag}, function(response) {});

    });

  });

  chrome.extension.onRequest.addListener(function(arr,sender,sendResponse) {

    if(arr[0].operation == 'loading') {
      renderCount(arr[0].count,arr[0].alreadyBlocked);
    }
    if(arr[0].operation == 'loadingDone') {
      renderCount(arr[0].count,arr[0].alreadyBlocked);
      loadButton.innerHTML = "<i class='icon-check'></i> Tüm Hesaplar Yüklendi";
      loadButton.setAttribute("status", "finished");
      loadButton.disabled = true;
    }
    if(arr[0].operation == 'started') {
      opStatus.innerHTML = "İşlem Sürüyor, Lütfen Bekleyiniz.<br>"+arr[0].blockedCount+" Hesap...";
    }
    if(arr[0].operation == 'completed') {
      opStatus.innerHTML = "İşlem Tamamlandı!<br>Toplam "+arr[0].blockedCount+" Hesap Bloklandı!";   
    }
  });

});
