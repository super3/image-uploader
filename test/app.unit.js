'use strict';

var supertest = require('supertest');
var api = supertest('http://localhost:3000');

/* jshint undef: true */
var app = require('../app.js');
var fs = require('fs');
var os = require('os');

describe('App', function() {

  before(function(done) {
     app.listen(3000, done);
  });

  it('index should return a 200 response', function(done) {
    api.get('/')
    .set('Accept', 'application/json')
    .expect(200, done);
  });

  var sampleData = 'HELLO';

  it('upload a sample image file', function(done) {
    // create sample data

    var tmpFile = os.tmpDir() + '/sample.jpg';
    fs.writeFileSync(tmpFile, sampleData);

    api.post('/upload')
            .attach('samplefile', tmpFile)
            .expect(200, done);
  });

  // find the bucket id (hacky)
  var _getAllFilesFromFolder = function(dir) {

    var filesystem = require('fs');
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file));
        } else {
          results.push(file);
        }

    });

    return results;

  };

  it('bucket page should return a 200 response', function(done) {
    var allFiles = _getAllFilesFromFolder('uploads');
    var bucketId = allFiles[0].split('/')[1];

    api.get('/bucket/' + bucketId)
    .set('Accept', 'application/json')
    .expect(200, done);
  });

  it('upload an invalid file', function(done) {
    // create sample invalid data
    var tmpFile = os.tmpDir() + '/sample.txt';
    fs.writeFileSync(tmpFile, sampleData);

    api.post('/upload')
            .attach('samplefile', tmpFile)
            .expect(415, done);
  });
});
