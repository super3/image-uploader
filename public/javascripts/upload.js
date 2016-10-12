'use strict';

/**
* Converts bytes into a human readable file size.
* @param {number} bytes Bytes of the file.
* @param {boolean} si Use SI units or not.
* @returns {string}
*/
function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

/**
* Adds a bucket object to a list in the DOM.
* @param {object} bucketObj Object containing metadata for a bucket.
*/
function addBucketDom(bucketObj) {
  // Create bucket text that includes bucket id, file count, and file size
  bucketText = "Bucket " + bucketObj.bucketId + " (" + bucketObj.fileCount +
  " files, " + humanFileSize(bucketObj.fileSize) +")"

  // Create list and link elements to add to the DOM
  var liElement=document.createElement("li");
  var aElement=document.createElement("a");

  // Add create a textnode with the bucket text
  var textnode=document.createTextNode(bucketText);

  // Add bucket id to the link and then add bucket text to the link
  aElement.setAttribute('href', "/bucket/" + bucketObj.bucketId);
  aElement.appendChild(textnode);

  // Add the link to the list element
  liElement.appendChild(aElement);

  // Add the list element to the list
  document.getElementById("bucket-list").appendChild(liElement);
}

/**
* Loads a list of buckets from local storage and adds them to the DOM.
*/
function loadBucketsLocal() {
  var bucketList = localStorage.getItem("bucketList");
  if (bucketList !== null) {
    bucketList = JSON.parse(bucketList);
    bucketList.forEach(addBucketDom)
  }
}

// Load buckets.
loadBucketsLocal();

/**
* Adds a bucket object to a list in the DOM.
* @param {object} bucketObj Object containing metadata for a bucket.
*/
function addBucket(bucketObj) {
  // get the bucket list from local storage
  var bucketList = localStorage.getItem("bucketList");

  // if there is no bucket list create it, else add the new bucket
  if (bucketList === null) {
    bucketList = [bucketObj];
  }
  else {
    bucketList = JSON.parse(bucketList);
    bucketList.push(bucketObj);
  }
  localStorage.setItem("bucketList", JSON.stringify(bucketList));

  // add the bucket to the current DOM
  addBucketDom(bucketObj);
}

$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload
    // in the AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);

          // convert response to bucket object
          var response = JSON.parse(data);
          var bucketObj = {
            bucketId: response.bucketId,
            fileCount: files.length,
            fileSize: response.totalFileSize
          }

          // add to local storage and the DOM
          addBucket(bucketObj)
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});
