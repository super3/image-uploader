'use strict';

var supertest = require('supertest');
var api = supertest('http://localhost:3000');

/* jshint undef: true */
var app = require('../app.js');
var fs = require('fs');
var os = require('os');

// internal modules
var db = require('../lib/db.js');

describe('App', function() {

  before(function(done) {
     app.listen(3000, done);
  });

  // create sample data
  var sampleData = 'HELLO';
  var tmpFile = os.tmpDir() + '/sample.jpg';
  var tmpFile2 = os.tmpDir() + '/sample2.jpg';
  fs.writeFileSync(tmpFile, sampleData);
  fs.writeFileSync(tmpFile2, sampleData);

  // create sample invalid data
  var tmpFile3 = os.tmpDir() + '/sample.txt';
  fs.writeFileSync(tmpFile3, sampleData);

  it('index should return a 200 response', function(done) {
    api.get('/')
    .expect(200, done);
  });

  it('upload a sample image file', function(done) {
    api.post('/upload')
            .attach('samplefile', tmpFile)
            .field('title', 'A sample title.')
            .field('comment', 'A sample comment.')
            .expect(200, done);
  });

  it('upload multiple image files', function(done) {
    api.post('/upload')
            .attach('samplefile', tmpFile)
            .attach('samplefile2', tmpFile2)
            .field('title', 'A sample title.')
            .field('comment', 'A sample comment.')
            .expect(200, done);
  });


  it('thread page should return a 200 response', function(done) {
    // grab the most recent thread id and try to load page
    db.findIndexThreads(function (err, threads){
        api.get('/thread/' + threads[0].threadId)
        .expect(200, done);
    });
  });

  it('upload an invalid file', function(done) {
    api.post('/upload')
            .attach('invalidfile', tmpFile3)
            .expect(415, done);
  });
});
