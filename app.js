'use strict';

var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');
var utils = require('./lib/utils.js');

// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files
  // in a single request
  form.multiples = true;

  // generate a unique bucket id
  var bucketId = mongoose.Types.ObjectId();

  // store all uploads in the /uploads/bucket_id directory
  var bucketDir = '/uploads/' + bucketId;
  form.uploadDir = path.join(__dirname, bucketDir);

  // create uploads directory if it doesn't exist
  utils.setupUploadDir();

  // if /uploads/bucket_id directory doesn't exist, create it
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir);
  }

  var totalFileSize = 0;

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('fileBegin', function(name, file) {

    if(file.type !== 'image/jpeg' && file.type !==
     'image/png' && file.type !== 'image/gif') {
        console.log(file.type);
       }
  });

  form.on('file', function(field, file) {
    var correctPath = path.join(form.uploadDir, file.name);
    fs.renameSync(file.path, correctPath);
    totalFileSize += utils.getFilesizeInBytes(correctPath);
  });


  // log any errors that occur
  form.on('error', function(err) {
    /* istanbul ignore next */
    console.log('An error has occured: \n' + err);
    //console.log(res);
    //res.status(500).send('Somthing broke!');
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end(JSON.stringify({
      bucketId: bucketId,
      totalFileSize: totalFileSize})
    );
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.use('/uploads', express.static('./uploads'));

app.get('/bucket/:bucketId', function(req, res){
  var bucketId = req.params.bucketId;
  console.log(bucketId);

  var _getAllFilesFromFolder = function(dir) {

    var results = [];

    fs.readdirSync(dir).forEach(function(file) {
        console.log(file);
        results.push({
          name: file,
          url:  '/uploads/' + bucketId + '/' + file});
    });

    return results;

  };

  var result = _getAllFilesFromFolder(__dirname + '/uploads/' + bucketId);
  console.log(result);

  res.render('bucket.html', {files:result});
});

// start the server
app.listen(3000, function(){
  console.log('Server listening on port 3000...');
});
