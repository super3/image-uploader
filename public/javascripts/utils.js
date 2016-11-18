'use strict';

var Utils = {};

/**
* Converts bytes into a human readable file size.
* @param {number} bytes Bytes of the file.
* @param {boolean} si Use SI units or not.
* @returns {string}
*/
Utils.humanFileSize = function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
};

Utils.objectIdAgo = function objectIdAgo(objectId) {
  var dateFromObjectId = function (objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };

  function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + ' years';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + ' months';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + ' days';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + ' hours';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
}

  var dateObj = dateFromObjectId(objectId);
  return timeSince(dateObj) + ' ago';
};

if( typeof module !== 'undefined' ) {
  module.exports = {
    humanFileSize: Utils.humanFileSize,
    objectIdAgo: Utils.objectIdAgo
  };
}
