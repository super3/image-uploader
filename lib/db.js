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
module.exports.imageModel = imageModel;

// create thread
function createThread(thread, callback) {

  // create sample image
  var image  = new imageModel({
    imageId: thread.imageId,
    threadId: thread.threadId,
    author: thread.author,
    fileName: thread.fileName,
    title: thread.title,
    comment: thread.comment,
    firstPost: thread.firstPost
  });

  // save the sample image to the db
  image.save(function (err) {
    if (err) {
      console.log('got here');
      return callback(err);
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

function findThreadPosts(threadId, callback) {

  imageModel.find({ threadId: threadId }, function(err, threads) {
    if (err) {
      return callback(err);
    }

    callback(null, threads);
  }).sort('+imageId');

}

module.exports.findThreadPosts = findThreadPosts;
