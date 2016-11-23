'use strict';
/*globals $:false */

$('#title').on('input', function() {

  // grab form data
  var title = document.getElementById('title');
  var comment = document.getElementById('comment');
  var submit = document.getElementById('submit');

  // make sure we don't have an empty title
  submit.disabled = !(title.value.length > 0);

  return false;
});
