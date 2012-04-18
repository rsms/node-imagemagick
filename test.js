var util = require('util'),
    fs = require('fs'),
    im = require('./imagemagick');

var path = 'sample-images/jpeg5.jpg';
var imdata = fs.readFileSync(path, 'binary');

im.identify(path, function(err, features){
  if (err) return util.error(err.stack || err);
  util.puts('features: '+util.inspect(features));
})

im.identify({data:imdata}, function(err, features){
  if (err) return util.error(err.stack || err);
  util.puts('features: '+util.inspect(features));
})

im.readMetadata(path, function(err, metadata){
  if (err) return util.error(err.stack || err);
  util.puts('metadata: '+util.inspect(metadata));
})

im.readMetadata({data:imdata}, function(err, metadata){
  if (err) return util.error(err.stack || err);
  util.puts('metadata: '+util.inspect(metadata));
})

var timeStarted = new Date;
im.resize({
  srcPath: path,
  dstPath: path+'.resized.jpg',
  width: 256
}, function(err, stdout, stderr){
  if (err) return util.error(err.stack || err);
  util.puts('real time taken for convert: '+((new Date)-timeStarted)+' ms')
  im.identify(['-format', '%b', path+'.resized.jpg'], function(err, r){
    if (err) throw err;
    util.puts('size: '+r.substr(0,r.length-2)+' Bytes');
  })
})

timeStarted = new Date;
im.resize({
  srcData: imdata,
  width: 256
}, function(err, stdout, stderr){
  if (err) return util.error(err.stack || err);
  util.puts('real time taken for convert (with buffers): '+((new Date)-timeStarted)+' ms');
  fs.writeFileSync(path+'.resized-io.jpg', stdout, 'binary');
  util.puts('size: '+stdout.length+' Bytes');
})
