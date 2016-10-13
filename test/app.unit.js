'use strict';

var supertest = require('supertest'),
api = supertest('http://localhost:3000'),
app = require('../app.js'),
fs = require('fs'),
os = require('os');

describe('App', function() {
  console.log(app);

  it('index should return a 200 response', function(done) {
    api.get('/')
    .set('Accept', 'application/json')
    .expect(200, done);
  });

  // create sample data
  var sampleData = 'HELLO';
  var tmpFile = os.tmpDir() + '/sample.txt';
  fs.writeFileSync(tmpFile, sampleData);

  console.log(tmpFile);

  it('upload a sample file', function(done) {
    api.post('/upload')
            .attach('samplefile', tmpFile)
            .expect(200, done);
  });

});
