'use strict';

var expect = require('chai').expect;
var utils = require('../lib/utils.js');

describe('Backend Utils', function() {

  describe('#getFilesizeInBytes', function() {

    // create sample data
    var sampleData = 'HELLO';
    var tmpFile = utils.createSampleFile('sample.text', sampleData);

    it('check small sample file byte size', function() {
      expect(utils.getFilesizeInBytes(tmpFile)).to.equal(sampleData.length);
    });

  });

  describe('#objectIdAgo', function() {

    it('check timeSince function', function() {
      console.log(utils.timeSince());
    });

  });

});
