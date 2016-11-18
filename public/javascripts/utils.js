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

if( typeof module !== 'undefined' ) {
  module.exports = {
    humanFileSize: Utils.humanFileSize
  };
}
