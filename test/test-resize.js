var fs = require('fs'),
    im = require('../imagemagick'),
    assert = require('assert');

var path = __dirname+'/fixtures/blue-bottle-coffee.jpg';
var imdata = fs.readFileSync(path, 'binary');


describe('resize()', function() {

  it('should resize the image (by file name) and not return an error', function (done) {
    var outFile = 'test-resized.jpg';
    im.resize({
      srcPath: path,
      dstPath: outFile,
      width: 256
    }, function (err, stdout, stderr){
      assert.ifError(err);
      // console.log('resize(...) wrote "test-resized.jpg"');
      im.identify(['-format', '%b', outFile], function (err, r){
        assert.ifError(err);
        assert(r, "Identify should report the file size");
        // console.log("identify(['-format', '%b', 'test-resized.jpg']) ->", r);
        done();
      });
    });
  });

  it('should resize the image (using raw data) and not return an error', function (done) {
    var outFile = 'test-resized-io.jpg';
    im.resize({
      srcData: imdata,
      width: 256
    }, function (err, stdout, stderr){
      assert.ifError(err);
      fs.writeFileSync(outFile, stdout, 'binary');
      // console.log('resize(...) wrote "test-resized-io.jpg" ('+stdout.length+' Bytes)');
      done();
    });
  });

});

