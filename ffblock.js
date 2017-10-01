  var comarList = [];
  var skippedFollowing = [];
  var skippedFollower = [];
  console.log("followerFlag is "+followerFlag);

  $('.ProfileCard').each(function() {  
    if($(this).find('.user-actions').hasClass('following')) {
      skippedFollowing.push($(this).attr('data-screen-name'));
    } else if ($(this).find('.FollowStatus').length > 0 && followerFlag == 0) {
      skippedFollower.push($(this).attr('data-screen-name'));
    } else {
      comarList.push($(this)); 
    };
  });

  comarList.forEach(function(acc) {
    if (($('.alert-messages .hidden'))) {
        $('.alert-messages').remove();
    }
    $(acc).find('.user-dropdown').trigger('click');
    $(acc).find('.block-text').find('.dropdown-link').trigger('click');
    $('.block-button').trigger('click');
  });

  skippedFollowing = skippedFollowing.map(function(e) {return '@' + e});
  skippedFollower = skippedFollower.map(function(e) {return '@' + e});

  if (followerFlag == 1) {
    alert("> İşlem tamam! " + comarList.length + " hesap bloklandı!\n > Takip ettiğin için atlanan hesaplar:\n" + skippedFollowing.join(", "));
  } else {
    alert("> İşlem tamam! " + comarList.length + " hesap bloklandı!\n > Takip ettiğin için atlanan hesaplar:\n" + skippedFollowing.join(", ") + "\n> Seni takip ettiği için atlanan hesaplar:\n" + skippedFollower.join(", "));
  }