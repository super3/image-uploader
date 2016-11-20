'use strict';
/*globals $:false */

Dropzone.options.newThread = {
  init: function() {
    var self = this;

    // new file added
    self.on('addedfile', function(file) {
      console.log('new file added ', file);
    });

    // send file starts
    self.on('sending', function(file) {
      console.log('upload started', file);
    });

    // file completed
    self.on('complete', function(file) {
      dom.addThreadDom(file.xhr.response, file);
      console.log('complete upload');
    });

  }
};
