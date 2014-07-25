var fs = require('fs'),
    im = require('../imagemagick');

var path = __dirname+'/sample-images/flynn_pentax_645D.jpg';
var targetDirectory = __dirname + '/test-results/';

(function () {
  var opt, timeStarted = new Date;
  im.crop(opt = {
    srcPath: path,
    dstPath: targetDirectory + 'cropped.jpg',
    width: 200,
    height: 90,
    quality: 1
  }, function (err, stdout, stderr){
    if (err) return console.error(err.stack || err);
    console.log('crop(',opt,') ->', stdout);
    console.log('Real time spent: '+(new Date() - timeStarted) + ' ms');
  });
})();

(function () {
  var opt, timeStarted = new Date;
  im.crop(opt = {
    srcPath: path,
    dstPath: targetDirectory + 'cropped2.jpg',
    width: 200,
    height: 90,
    gravity: "North",
    quality: 1
  }, function (err, stdout, stderr){
    if (err) return console.error(err.stack || err);
    console.log('crop(',opt,') ->', stdout);
    console.log('Real time spent: '+(new Date() - timeStarted) + ' ms');
  });
})();
