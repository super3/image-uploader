'use strict';

// get external modules
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// get internal config
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
function createThread(imageId, threadId, title, comment, firstPost, callback) {

  // create sample image
  var image = new imageModel({
    imageId: imageId,
    threadId: threadId,
    author: 'anonymous',
    fileName: 'image.jpg',
    title: title,
    comment: comment,
    firstPost: firstPost
  });

  // save the sample image to the db
  image.save(function (err) {
    if (err) {
      return callback(err);
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
  }).limit(config.threadsOnIndex).sort('-threadId');

}

module.exports.findIndexThreads = findIndexThreads;
