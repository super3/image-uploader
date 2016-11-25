'use strict';
/*globals $:false */

var numFiles = 0;
var isThread = location.href.split('/')[3] === 'thread';

function enableSubmit() {
  var title = document.getElementById('title');
  var submit = document.getElementById('submit');

  if (!isThread) {
    submit.disabled = (title.value.length === 0 || numFiles === 0);
  }
  else {
    submit.disabled = (numFiles === 0);
  }

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
    self.on('addedfile', function(file) {
      numFiles = this.files.length;
      enableSubmit();
      console.log('new file added ', file);
    });

    // File removed
    self.on('removedfile', function(file) {
      numFiles = this.files.length;
      enableSubmit();
      console.log('new file added ', file);
    });

    // Send file starts
    self.on('sending', function(file) {
      console.log('upload started', file);
    });

    // File completed
    self.on('complete', function(file) {
      /*global dom */
      dom.addThreadDom(file.xhr.response, file);
      console.log('complete upload');
    });

  }
};
