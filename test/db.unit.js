'use strict';

var db = require('../lib/db.js');
var mongoose = require('mongoose');

describe('Database', function() {

  var testThreadId = mongoose.Types.ObjectId();

  var testThread = {
    imageId: mongoose.Types.ObjectId(),
    threadId: testThreadId,
    author: 'anonymous',
    fileName: 'image.jpg',
    title: 'Test Title',
    comment: 'Test Comment',
    firstPost: true
  };

  var testReply = {
    imageId: mongoose.Types.ObjectId(),
    threadId: testThreadId,
    author: 'anonymous',
    fileName: 'image.jpg',
    title: '',
    comment: 'Test Reply',
    firstPost: false
  };

  it('create an image thread', function() {

    db.createThread(testThread, function(){});
    db.createThread(testReply, function(){});

    db.imageModel.find({ threadId: testThreadId }, function (err, kittens) {
      if (err) return console.error(err);
      console.log(kittens);
    });

  });

});
