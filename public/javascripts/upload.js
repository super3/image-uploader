'use strict';

/**
* Returns card link and image.
* @param {object} threadObj Object containing metadata for a thread.
* @param {object} files Object containing upload file images.
*/
function addCardLink(threadObj, files) {
  var cardLink = document.createElement('a');
  var cardImage = document.createElement('img');

  // Pull the first image direct from upload so we can display it quickly
  var fileReader = new FileReader();
  fileReader.onload = function () {
    cardImage.src = fileReader.result;
    cardImage.classList.add('card-img-top');
    cardImage.classList.add('img-fluid');
    cardLink.appendChild(cardImage);
  };
  fileReader.readAsDataURL(files[0]);

  // Set link and add to link to card
  cardLink.setAttribute('href', '/thread/' + threadObj.threadId);

  return cardLink;
}

/**
* Returns card text with 'Uploaded 0 mins ago'
*/
function addCardText() {
  var cardText = document.createElement('p');
  var cardTime= document.createElement('small');
  cardText.classList.add('card-text');
  cardTime.classList.add('text-muted');
  cardTime.innerHTML = 'Uploaded 0 mins ago';
  cardText.appendChild(cardTime);

  return cardText;
}

/**
* Returns card block.
* @param {object} threadObj Object containing metadata for a thread.
*/
function addCardBlock(threadObj) {
  var cardBlock = document.createElement('div');
  cardBlock.classList.add('card-block');
  var title = document.createElement('h4');
  title.classList.add('card-title');
  var titleLink = document.createElement('a');

  titleLink.classList.add('thumbnail-title');
  titleLink.innerHTML = threadObj.threadTitle;
  titleLink.setAttribute('href', '/thread/' + threadObj.threadId);
  title.appendChild(titleLink);
  cardBlock.appendChild(title);
  cardBlock.appendChild(addCardText());

  return cardBlock;
}

/**
* Adds a thread to the DOM.
* @param {object} threadObj Object containing metadata for a thread.
* @param {object} files Object containing upload file images.
*/
function addThreadDom(data, files) {

  // convert response to bucket object
  var response = JSON.parse(data);
  var threadObj = {
    threadTitle: response.threadTitle,
    threadId: response.threadId,
  };

  // Create thread card
  var card = document.createElement('div');
  card.classList.add('card');

  // Add card link with image
  card.appendChild(addCardLink(threadObj, files));
  card.appendChild(addCardBlock(threadObj));

  // Add the card to the DOM
  document.getElementById('thread-cards').prepend(card);
}

$('.progress').show();
$('#chooser').show();
$('#upload-input').hide();

$('#chooser').on('click', function (){
    console.log('clicked');
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    return false;
});

$('#newThread').on('submit', function(){

  var files = $('#upload-input', this).get(0).files;
  var title = $("[name='title']", this);
  var comment = $("[name='comment']", this);

  console.log(title.val());
  console.log(comment.val());

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload
    // in the AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    formData.append('comment', comment.val());
    formData.append('title', title.val());

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          addThreadDom(data, files);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }

  return false;
});
