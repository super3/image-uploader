'use strict';

var fs = require('fs');
var config = require('../config.js');

/**
* Gets the filesize in bytes,
* @param {string} filename Path to the file.
* @returns {number}
*/
function getFilesizeInBytes(filename) {
 var stats = fs.statSync(filename);
 var fileSizeInBytes = stats.size;
 return fileSizeInBytes;
}

module.exports.getFilesizeInBytes = getFilesizeInBytes;

/**
* Create the upload directory if it doesn't exist.
*/
function setupUploadDir() {
  // if /uploads directory doesn't exist, create it
  if (!fs.existsSync(config.uploadDir)) {
    /* istanbul ignore next */
    fs.mkdirSync(config.uploadDir);
  }
}

module.exports.setupUploadDir = setupUploadDir;
