'use strict';

var expect = require('chai').expect;
var utils = require('../lib/utils.js');

var fs = require('fs');
var os = require('os');

describe('utils', function() {

  describe('#getFilesizeInBytes', function() {

    // create sample data
    var sampleData = 'HELLO';

    // get temp file location
    var tmpFile = os.tmpDir() + '/sample.txt';

    // add sample file
    fs.writeFileSync(tmpFile, sampleData);

    it('check small sample file byte size', function() {
      expect(utils.getFilesizeInBytes(tmpFile)).to.equal(sampleData.length);
    });

  });

});
