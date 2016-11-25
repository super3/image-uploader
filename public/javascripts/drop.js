'use strict';
/*globals $:false */

var numFiles = 0;

/**
 * Only enable the submit button if the required fields are entered.
 */
function enableSubmit() {

  var submitBtn = document.getElementById('submit');
  var isThread = location.href.split('/')[3] === 'thread';

  if (!isThread) {
    var title = document.getElementById('title');
    submitBtn.disabled = (title.value.length === 0 || numFiles === 0);
  }
  else {
    submitBtn.disabled = (numFiles === 0);
  }

}

function resetForm() {
  document.getElementById('title').value = '';
  document.getElementById('comment').value = '';
}

// make sure at the title is filled
$('#title').on('input', function() {
  enableSubmit();
});

/*global Dropzone */
Dropzone.options.newThread = {

  // The configuration
  autoProcessQueue: false,
  uploadMultiple: true,
  parallelUploads: 10,
  maxFiles: 50,
  previewsContainer: '.dropzone-previews',
  clickable: '.dropzone-upload',

  // The setting up of the dropzone
  init: function() {
    var self = this;

    // config
    self.options.addRemoveLinks = true;
    self.options.dictRemoveFile = 'Delete';

    // First change the button to actually tell Dropzone to process the queue.
    this.element.querySelector('button[type=submit]').addEventListener('click',
     function(e) {
      // Make sure that the form isn't actually being sent.
      e.preventDefault();
      e.stopPropagation();
      self.processQueue();
    });

    // New file added
    self.on('addedfile', function() {
      numFiles = this.files.length;  // update number of files
      enableSubmit();
    });

    // File removed
    self.on('removedfile', function() {
      numFiles = this.files.length;  // update number of files
      enableSubmit();
    });

    // Send file starts
    self.on('sending', function(file, xhr, data) {
      // add the form data to the upload
      data.append('title', document.getElementById('title').value);
      data.append('comment', document.getElementById('comment').value);
    });

    // File completed
    self.on('complete', function(file) {
      /*global dom */
      dom.addThreadDom(file.xhr.response, file);
      this.removeAllFiles();
      resetForm();
    });

  }
};
