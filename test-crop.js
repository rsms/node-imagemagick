var util = require('util'),
    fs = require('fs'),
    im = require('./imagemagick');

var path = 'img.jpg';
var timeStarted = new Date;

im.crop({
  srcPath: path,
  dstPath: 'cropped.jpg',
  width: 2000,
  height: 900,
  quality: 1
}, function(err, stdout, stderr){
  if (err) return util.error(err.stack || err);

  util.puts('real time taken for convert: ' + (new Date() - timeStarted) + ' ms')

  im.identify(['-format', '%b', path + '.cropped.jpg'], function(err, r){
    if (err) throw err;
    util.puts('size: ' + r.substr(0, r.length-2) + ' Bytes');
  })
})
