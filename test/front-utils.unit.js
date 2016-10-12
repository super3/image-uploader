'use strict';

var expect = require('chai').expect;
var utils = require('../public/javascripts/utils.js');

describe('utils', function() {

  describe('#humanFileSize', function() {
    it('check 1000 bytes', function() {
      expect(utils.humanFileSize(1000, true)).to.equal('1.0 kB');
    });

    it('check 1024 bytes', function() {
      expect(utils.humanFileSize(1024, false)).to.equal('1.0 KiB');
    });

    it('check below threshold', function() {
      expect(utils.humanFileSize(10)).to.equal('10 B');
    });

  });

});
