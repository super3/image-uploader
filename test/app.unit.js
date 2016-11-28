'use strict';

var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000');
var mongoose = require('mongoose');

/* jshint undef: true */
var app = require('../app.js');
var config = require('../config.js');
var db = require('../lib/db.js');
var utils = require('../lib/utils.js');

describe('App', function() {

  before(function(done) {
     app.listen(3000, done);
  });

  it('index should return a 200 response', function(done) {
    api.get('/').expect(200, done);
  });

  it('upload a sample image file', function(done) {
    let threadId = mongoose.Types.ObjectId();
    let expectedResponse = {
            threadTitle: 'A sample title.',
            threadId: threadId
        };
    api.post('/upload/' + threadId)
            .attach('samplefile', utils.createSampleFile('sample1.jpg'))
            .field('title', 'A sample title.')
            .field('comment', 'A sample comment.')
            .expect(200)
            .end(function (err, res) {
              expect(res.text).to.equal(JSON.stringify(expectedResponse));
              done();
            });
  });

  it('upload multiple image files', function(done) {
    let threadId = mongoose.Types.ObjectId();
    api.post('/upload/' + threadId)
            .attach('samplefile', utils.createSampleFile('sample2.jpg'))
            .attach('samplefile2', utils.createSampleFile('sample3.jpg'))
            .field('title', 'A sample title.')
            .field('comment', 'A sample comment.')
            .expect(200, done);
  });

  it('upload an invalid file', function(done) {
    let threadId = mongoose.Types.ObjectId();
    api.post('/upload/' + threadId)
            .attach('invalidfile', utils.createSampleFile('sample.txt'))
            .expect(415, done);
  });


  it('thread page should return a 200 response', function(done) {
    // grab the most recent thread id and try to load page
    db.findIndexThreads(config.threadsOnIndex, function (err, threads){
        api.get('/thread/' + threads[0].threadId)
        .expect(200, done);
    });
  });

  it('image page should return a 200 response', function(done) {
    // grab an image from the most recent id and try to load page
    db.findIndexThreads(config.threadsOnIndex, function (err, threads){
        api.get('/image/' + threads[0].imageId + '/' + threads[0].fileName)
        .expect(200, done);
    });
  });

});
