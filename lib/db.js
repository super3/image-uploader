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
  image.save(callback);

}

module.exports.createThread = createThread;

function findIndexThreads(limitThreads, callback) {

  imageModel.find({ firstPost: 'true' }, callback)
  .limit(limitThreads).sort('-imageId');

}

module.exports.findIndexThreads = findIndexThreads;

function findThreadPosts(threadId, callback) {
  imageModel.find({ threadId: threadId }, callback).sort('+imageId');
}

module.exports.findThreadPosts = findThreadPosts;

function threadExists(threadId, callback) {
  imageModel.count({ threadId: threadId }, function(err, c) {
    callback(c > 0);
  });
}

module.exports.threadExists = threadExists;
