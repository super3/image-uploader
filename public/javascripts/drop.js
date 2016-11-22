'use strict';
/*globals $:false */

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

    // First change the button to actually tell Dropzone to process the queue.
    this.element.querySelector('button[type=submit]').addEventListener('click', function(e) {
      // Make sure that the form isn't actually being sent.
      e.preventDefault();
      e.stopPropagation();
      self.processQueue();
    });

    // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
    // of the sending event because uploadMultiple is set to true.
    this.on('sendingmultiple', function() {
      // Gets triggered when the form is actually being sent.
      // Hide the success button or the complete form.
    });
    this.on('successmultiple', function(files, response) {
      // Gets triggered when the files have successfully been sent.
      // Redirect user or notify of success.
    });
    this.on('errormultiple', function(files, response) {
      // Gets triggered when there was an error sending the files.
      // Maybe show form again, and notify user of error
    });

    // New file added
    self.on('addedfile', function(file) {
      console.log('new file added ', file);
    });

    // Send file starts
    self.on('sending', function(file) {
      console.log('upload started', file);
    });

    // File completed
    self.on('complete', function(file) {
      dom.addThreadDom(file.xhr.response, file);
      console.log('complete upload');
    });

  }
};
