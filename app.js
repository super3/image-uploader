var express = require('express');
var app = express();

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files
  // in a single request
  form.multiples = true;

  // generate a unique bucket id
  var bucket_id = mongoose.Types.ObjectId();

  // store all uploads in the /uploads/bucket_id directory
  bucket_dir = '/uploads/' + bucket_id;
  form.uploadDir = path.join(__dirname, bucket_dir);

  // if /uploads/bucket_id directory doesn't exist, create it
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir)
  }

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.use('/uploads', express.static('./uploads'));

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
