var fs = require('fs');

/**
* Gets the filesize in bytes,
* @param {string} filename Path to the file.
* @returns {number}
*/
function getFilesizeInBytes(filename) {
 var stats = fs.statSync(filename)
 var fileSizeInBytes = stats["size"]
 return fileSizeInBytes
}

module.exports.getFilesizeInBytes = getFilesizeInBytes;
