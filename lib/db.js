'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
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
  title: String,
  comment: String,
  firstPost: Boolean
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
    title: 'test',
    comment: 'test',
    firstPost: true
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

module.exports.createThread = createThread;

function findIndexThreads(callback) {

  imageModel.find({ firstPost: 'true' }, function(err, threads) {
    if (err) {
      return callback(err);
    }

    callback(null, threads);
    //return "test";
  }).limit(5).sort('+threadId');

}

module.exports.findIndexThreads = findIndexThreads;
