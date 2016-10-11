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

function addBucketDom(bucketObj) {
  bucketText = "Bucket " + bucketObj.bucketId + " (" + bucketObj.fileCount +
    " files, " + humanFileSize(bucketObj.fileSize) +")"

    var liElement=document.createElement("li");
    var aElement=document.createElement("a");

    var textnode=document.createTextNode(bucketText);
    aElement.setAttribute('href', "/bucket/" + bucketObj.bucketId);
    aElement.appendChild(textnode);
    liElement.appendChild(aElement);

    document.getElementById("bucket-list").appendChild(liElement);
}

function loadBucketsLocal() {
  var bucketList = localStorage.getItem("bucketList");
  if (bucketList !== null) {
    bucketList = JSON.parse(bucketList);
    bucketList.forEach(addBucketDom)
  }
}
loadBucketsLocal();

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

          var response = JSON.parse(data);
          console.log(response.bucketId);

          var bucketObj = {
            bucketId: response.bucketId,
            fileCount: files.length,
            fileSize: response.totalFileSize
          };

          var bucketList = localStorage.getItem("bucketList");
          if (bucketList === null) {
            bucketList = [bucketObj];
          }
          else {
            bucketList = JSON.parse(bucketList);
            bucketList.push(bucketObj);
          }
          localStorage.setItem("bucketList", JSON.stringify(bucketList));

          console.log(bucketList)

          addBucketDom(bucketObj);
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
