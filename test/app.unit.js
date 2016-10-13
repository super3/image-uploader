'use strict';

var supertest = require('supertest'),
api = supertest('http://localhost:3000'),
app = require('../app.js');

describe('App', function() {
  console.log(app);

  it('index should return a 200 response', function(done) {
    api.get('/')
    .set('Accept', 'application/json')
    .expect(200, done);
  });

});
