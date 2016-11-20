'use strict';
/*globals $:false */

$('#newThread').on('submit', function(){

  // grab form data
  var title = $('[name=\'title\']', this);
  var comment = $('[name=\'comment\']', this);

  // make sure we don't have an empty title
  if (title.val().length > 0){
    // create a FormData object which will be sent as the data payload
    // in the AJAX request, with the comment and title fields
    var formData = new FormData();
    formData.append('comment', comment.val());
    formData.append('title', title.val());

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){ console.log(data); }
    });
  }

  return false;
});
