'use strict';
/*globals $:false */

$('#title').on('input', function() {

  // grab form data
  var title = document.getElementById('title');
  var comment = document.getElementById('comment');
  var submit = document.getElementById('submit');

  // make sure we don't have an empty title
  if (title.value.length > 0) {
    submit.disabled = false;
  }
  else {
    submit.disabled = true;
  }

  return false;
});
