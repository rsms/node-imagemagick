var sys = require('sys'),
    im = require('./imagemagick');

var path = 'sample-images/jpeg5.jpg';

im.identify(path, function(err, features){
  if (err) throw err;
  sys.puts('features: '+sys.inspect(features));
})

im.readMetadata(path, function(err, metadata){
  if (err) throw err; sys.puts('metadata: '+sys.inspect(metadata));
})

im.resize({
  srcPath: path,
  dstPath: path+'.resized.jpg',
  width: 256
}, function(err, stdout, stderr){
  if (err) throw err;
  im.identify(['-format', '%b', path+'.resized.jpg'], function(err, r){
    if (err) throw err;
    sys.puts('size: '+r.substr(0,r.length-2)+' Bytes');
  })
})
