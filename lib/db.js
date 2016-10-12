'use strict';

var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.connect('mongodb://' + config.mongoHost + ':' +
 config.mongoPort + '/' + config.mongoName);

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Tabby' });
kitty.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('woof');
  }
});

Cat.find({name: 'Tabby'}, function(err, cat) {
  console.log(cat, err);
});
