'use strict';

/**
* Adds a bucket object to a list in the DOM.
* @param {object} threadObj Object containing metadata for a thread.
*/
function addThreadDom(threadObj, files) {
  // Create list and link elements to add to the DOM
  var divElement = document.createElement('div');
  divElement.classList.add('card');

  var aElement = document.createElement('a');
  var imgElement = document.createElement('img');

  var fileReader = new FileReader();
  fileReader.onload = function () {
    imgElement.src = fileReader.result;
    imgElement.classList.add('card-img-top');
    imgElement.classList.add('img-fluid');

    aElement.appendChild(imgElement);
  };
  fileReader.readAsDataURL(files[0]);

  // Add create a textnode with the bucket text
  var textnode=document.createTextNode(threadObj.threadTitle);

  // Add bucket id to the link and then add bucket text to the link
  aElement.setAttribute('href', '/thread/' + threadObj.threadId);
  //aElement.appendChild(textnode);

  // Add the link to the list element
  divElement.appendChild(aElement);

  var divElement2 = document.createElement('div');
  divElement2.classList.add('card-block');
  var h4Element = document.createElement('h4');
  h4Element.classList.add('card-title');
  var aElement2 = document.createElement('a');
  aElement2.classList.add('thumbnail-title');
  aElement2.innerHTML = threadObj.threadTitle;
  aElement2.setAttribute('href', '/thread/' + threadObj.threadId);
  h4Element.appendChild(aElement2);
  divElement2.appendChild(h4Element);

  var pElement = document.createElement('p');
  var smallElement = document.createElement('small');
  pElement.classList.add('card-text');
  smallElement.classList.add('text-muted');
  smallElement.innerHTML = 'Uploaded 0 mins ago'

  pElement.appendChild(smallElement);
  divElement2.appendChild(pElement);

  divElement.appendChild(divElement2);




  // Add the list element to the list
  document.getElementById('thread-cards').prepend(divElement);
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
          console.log('upload successful!\n' + data);

          // convert response to bucket object
          var response = JSON.parse(data);

          console.log(data);

          var threadObj = {
            threadTitle: response.threadTitle,
            threadId: response.threadId,
          };

          // add to the DOM
          addThreadDom(threadObj, files);
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
