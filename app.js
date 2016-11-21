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

// setup view and public directory
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// load the index
app.get('/', function(req, res) {

  // find the most recent threads and send them to the index
  db.findIndexThreads(function(err, threads) {
    threads = utils.addTimeAgo(threads);
    var newThreadId = mongoose.Types.ObjectId();
    res.render('index.html', { threads: threads, newThreadId: newThreadId });
  });

});

// display all files in a thread
app.get('/thread/:threadId', function(req, res) {

  // find all the posts associated with the thread and sent to page
  db.findThreadPosts(req.params.threadId, function(err, posts) {
    posts = utils.addTimeAgo(posts);
    res.render('thread.html', { posts: posts });
  });

});

// send a single file image to the browser
app.get('/image/:imageId/:filename', function(req, res) {
  res.sendFile(__dirname + '/' + config.uploadDir + req.params.imageId);
});

// upload files (images only)
// jshint maxstatements: 20
app.post('/upload/:threadId', function(req, res) {

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // allow the user to upload multiple files in a single request
  form.multiples = true;

  // keep track of the total file size and if the upload is cancelled
  var uploadedFiles = [];
  var cancelled = false;

  // title and comment field
  var title = '';
  var comment = '';
  var threadId = req.params.threadId;

  // store all uploads in the /uploads/bucket_id directory
  form.uploadDir = path.join(__dirname, config.uploadDir);

  // create uploads directory and bucket directory if they doesn't exist
  utils.setupDir(config.uploadDir);
  utils.setupDir(form.uploadDir);

  // if the client somehow sneeks in something thats not an image,
  // then cancel the upload
  form.on('fileBegin', function(name, file) {
    if (file.type !== 'image/jpeg' && file.type !==
      'image/png' && file.type !== 'image/gif') {
      cancelled = true;

      res.status(415).send('Unsupported Media Type');
      res.end();
    }
  });

  form.on('field', function(name, value) {
    // experimenting with ternary operators
    title = (name === 'title') ? value : title;
    comment = (name === 'comment') ? value : comment;
  });

  // every time a file has been uploaded successfully, rename it to it's
  // orignal name, and also add it to the total file size
  form.on('file', function(field, file) {

    if (!cancelled) {
      // create a new id for this image
      var imageId = mongoose.Types.ObjectId();

      // add to array of uploaded files
      uploadedFiles.push({
        fileName: file.name,
        imageId: imageId,
        fileSize: utils.getFilesizeInBytes(file.path)
      });

      // rename
      var correctPath = path.join(form.uploadDir, imageId.toString());
      fs.renameSync(file.path, correctPath);
    }

  });


  // log any errors that occur
  form.on('error', function(err) {
    /* istanbul ignore next */
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {

    if (!cancelled) {
      // create a new id for this thread
      var firstPost = true;
      var lastPostId = '';

      uploadedFiles.forEach(function(entry) {
        if (firstPost) {

          var partialThread = {
            imageId: entry.imageId,
            threadId: threadId,
            author: 'anonymous',
            fileName: 'image.jpg',
            title: title,
            comment: comment,
            firstPost: true
          };

          db.createThread(partialThread);

          firstPost = false;
          lastPostId = entry.imageId;
        } else {
          var partialThread2 = {
            imageId: entry.imageId,
            threadId: threadId,
            author: 'anonymous',
            fileName: 'image.jpg',
            title: '',
            comment: '>> ' + lastPostId,
            firstPost: false
          };

          db.createThread(partialThread2);
          lastPostId = entry.imageId;
        }
      });

      res.end(JSON.stringify({
        threadTitle: title,
        threadId: threadId
      }));
    }

  });

  // parse the incoming request containing the form data
  form.parse(req);

});

// start the server, if running this script alone
if (require.main === module) {
  /* istanbul ignore next */
  app.listen(3000, function() {
    console.log('Server listening on port 3000...');
  });
}

module.exports = app;
