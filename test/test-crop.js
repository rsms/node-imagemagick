var fs = require('fs'),
    im = require('../imagemagick'),
    assert = require('assert');

var path = __dirname+'/sample-images/blue-bottle-coffee.jpg';

describe('crop()', function() {

  it('(simple) should crop the image and not return an error', function (done) {
    var opt;
    var outFile = 'cropped.jpg';
    im.crop(opt = {
      srcPath: path,
      dstPath: outFile,
      width: 200,
      height: 90,
      quality: 1
    }, function (err, stdout, stderr){
      assert.ifError(err);
      assert(fs.existsSync(outFile), "Output file exists");
      assert(
        fs.statSync(outFile).size >= 23,
        "Output has a length of at least 23 bytes"
      );
      // console.log('crop(',opt,') ->', stdout, stderr);
      done();
    });
  });

  it('with "gravity: North" should crop the image and not return an error', function (done) {
    var opt;
    var outFile = 'cropped2.jpg';
    im.crop(opt = {
      srcPath: path,
      dstPath: outFile,
      width: 200,
      height: 90,
      gravity: "North",
      quality: 1
    }, function (err, stdout, stderr){
      assert.ifError(err);
      assert(fs.existsSync(outFile), "Output file exists");
      assert(
        fs.statSync(outFile).size >= 23,
        "Output has a length of at least 23 bytes"
      );
      // console.log('crop(',opt,') ->', stdout, stderr);
      done();
    });
  });

});

