'use strict';

var fs = require('fs');
var os = require('os');

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
function setupDir(directory) {
  // if directory doesn't exist, create it
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

module.exports.setupDir = setupDir;

function createSampleFile(fileName, data = 'HELLO') {
  var tmpFile = os.tmpDir() + '/' + fileName;
  fs.writeFileSync(tmpFile, data);
  return tmpFile;
}

module.exports.createSampleFile = createSampleFile;
