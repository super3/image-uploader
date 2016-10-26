'use strict';

// get express
var express = require('express');
var app = express();

// get external modules
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var mongoose = require('mongoose');

// get internal modules
var utils = require('./lib/utils.js');
var db = require('./lib/db.js');
var config = require('./config.js');

// register '.html' extension with The Mustache Express
var mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');

// setup view, uploads, and public directory
app.set('views', __dirname + '/views');
app.use('/uploads', express.static('./uploads'));
app.use(express.static(path.join(__dirname, 'public')));

// load the index
app.get('/', function (req, res) {

    db.findIndexThreads(function (err, threads){
        if (err) {
          res.status(500).send('Internal server error');
          res.end();

          return;
        }
        res.render('index.html', {threads: threads});
    });

});

// upload files (images only)
// jshint maxstatements: 20
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

  // create uploads directory and bucket directory if they doesn't exist
  utils.setupDir(config.uploadDir);
  utils.setupDir(form.uploadDir);

  // keep track of the total file size and if the upload is cancelled
  var totalFileSize = 0;
  var cancelled = false;

  // if the client somehow sneeks something thats not an image,
  // then cancel the upload
  form.on('fileBegin', function(name, file) {
    if(file.type !== 'image/jpeg' && file.type !==
     'image/png' && file.type !== 'image/gif') {
        cancelled = true;

        res.status(415).send('Unsupported Media Type');
        res.end('415');
       }
  });

  form.on('field', function(name, value) {
      console.log(name, value);
  });

  // every time a file has been uploaded successfully, rename it to it's
  // orignal name, and also add it to the total file size
  form.on('file', function(field, file) {
    var correctPath = path.join(form.uploadDir, file.name);
    fs.renameSync(file.path, correctPath);

    totalFileSize += utils.getFilesizeInBytes(correctPath);

  });

  // log any errors that occur
  form.on('error', function(err) {
    /* istanbul ignore next */
    console.log('An error has occured: \n' + err);
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

// display all files in a bucket
app.get('/bucket/:bucketId', function(req, res){
  var bucketId = req.params.bucketId;

  var _getAllFilesFromFolder = function(dir) {

    var results = [];

    fs.readdirSync(dir).forEach(function(file) {
        results.push({
          name: file,
          url:  '/uploads/' + bucketId + '/' + file});
    });

    return results;

  };

  var result = _getAllFilesFromFolder(__dirname + '/uploads/' + bucketId);
  res.render('bucket.html', {files:result});
});

// start the server, if running this script alone
if (require.main === module) {
  /* istanbul ignore next */
  app.listen(3000, function(){
    console.log('Server listening on port 3000...');
  });
}

module.exports = app;
