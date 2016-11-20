'use strict';
/*globals $:false */

Dropzone.options.newThread = {
  init: function() {
    var self = this;
    // config
    self.options.addRemoveLinks = true;
    self.options.dictRemoveFile = 'Delete';

    // bind events

    //New file added
    self.on('addedfile', function(file) {
      console.log('new file added ', file);
    });

    // Send file starts
    self.on('sending', function(file) {
      console.log('upload started', file);
      $('.meter').show();
    });

    // File upload Progress
    self.on('totaluploadprogress', function(progress) {
      console.log('progress ', progress);
      $('.roller').width(progress + '%');
    });

    self.on('queuecomplete', function(progress) {
      $('.meter').delay(999).slideUp(999);
    });

    self.on('complete', function(file) {
      dom.addThreadDom(file.xhr.response, file);
      console.log('complete upload');
    });

    // On removing file
    self.on('removedfile', function(file) {
      console.log(file);
      $.ajax({
        url: '/uploaded/files/' + file.name,
        type: 'DELETE',
        success: function(result) {
          console.log(result);
        }
      });
    });

  }
};
