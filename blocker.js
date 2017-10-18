  var loading = false;
  var latestAction;

  window.MutationObserver = window.MutationObserver
      || window.WebKitMutationObserver
      || window.MozMutationObserver;

  var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.type == "attributes") {
          updateCounter();
          if(loading) {
            scroll();
          } 
        }
      });   
  });

  function startObserver() {
    observer.observe($('.GridTimeline-items')[0], {attributes: true});
  }
  function stopObserver() {
    observer.disconnect();
  }

  startObserver();
  updateCounter();

  var limit = 1000;
  var max = $('.ProfileNav-stat[data-nav=followers]').children('.ProfileNav-value').data('count');


  function updateCounter() { // count and send length to popup
    var cards = $('.GridTimeline-items .ProfileCard');
    var alreadyBlocked = cards.find('.user-actions.blocked').length;
    var rest = cards.length - alreadyBlocked;
    if(cards.length >= max) {
      chrome.extension.sendRequest([{'operation': 'loadingDone', count: rest,'alreadyBlocked': alreadyBlocked}]);
    } else {
      chrome.extension.sendRequest([{'operation': 'loading', count: rest,'alreadyBlocked': alreadyBlocked}]);
    }
  }

  function scroll() {
    window.scrollTo(0,document.body.scrollHeight);
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action == "start") {
      startObserver();
      scroll();
      loading = true;
    }
    if(request.action == "stop") {
      loading = false;
    }
    if(request.action == "block") {
      block(request.followerFlag);
    }
    if(request.action == "update") {
      updateCounter();
    }
  });

  function block(followerFlag) {

    var comarList = [];
    var skippedFollowing = [];
    var skippedFollower = [];
    var blockedCount = 0;
    // console.log(followerFlag);

    $('.GridTimeline-items .ProfileCard').each(function() { 
      var card = $(this);
      if(!card.find('.user-actions').hasClass('blocked')) {
        if(followerFlag) {
          comarList.push(card);
        } else {
          if(card.find('.FollowStatus').length == 0) {
            comarList.push(card);
          }
        }        
      }
    });

    comarList.forEach(function(acc) {
      if (($('.alert-messages .hidden'))) {
        $('.alert-messages').remove();
      }
      $(acc).find('.user-dropdown').trigger('click');
      $(acc).find('.block-text').find('.dropdown-link').trigger('click');
      $('.block-button').trigger('click');
      blockedCount++;
      chrome.extension.sendRequest([{'operation':'started', 'blockedCount': blockedCount}]);
    });

    chrome.extension.sendRequest([{'operation':'completed', 'blockedCount': blockedCount}]);  
  }

