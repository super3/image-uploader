'use strict';

var mongoose = require('mongoose');
var config = require('../config.js');

// setup mongo
mongoose.connect('mongodb://' + config.mongoHost + ':' +
 config.mongoPort + '/' + config.mongoName);

// define image schema
var imageSchema = new mongoose.Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  threadId: mongoose.Schema.Types.ObjectId,
  author: String,
  fileName: String,
  comment: String
});
var imageModel = mongoose.model('imageModel', imageSchema);

// create thread
function createThread() {

  // create sample image
  var image = new imageModel({
    imageId: mongoose.Types.ObjectId(),
    threadId: mongoose.Types.ObjectId(),
    author: 'anonymous',
    fileName: 'image.jpg',
    comment: 'test'
  });

  // save the sample image to the db
  image.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('works!');
    }
  });

}

createThread();

// find the sample image
imageModel.find({author: 'anonymous'}, function(err, image) {
  console.log(image, err);
});
