var fs = require('fs'),
    im = require('../imagemagick'),
    assert = require('assert');

var path = __dirname+'/sample-images/blue-bottle-coffee.jpg';
var imdata = fs.readFileSync(path, 'binary');


describe('identify()', function() {

  it('should return info when called with image path', function(done) {
    im.identify(path, function (err, features){
      assert.ifError(err);
      assert.strictEqual(features.format, 'JPEG');
      assert.strictEqual(features.geometry, '640x480');
      // console.log('identify(path) ->', features);
      done();
    });
  });

  it('should return info when called with object: {data: <raw image data>}', function(done) {
    im.identify({data:imdata}, function (err, features){
      if (err) return console.error(err.stack || err);
        assert.ifError(err);
        assert.strictEqual(features.format, 'JPEG');
        assert.strictEqual(features.geometry, '640x480');
        //console.log('identify({data:imdata}) ->', features);
        done();
    });
  });

});


describe('readMetadata()', function() {

  it('should return info when called with image path', function(done) {
    im.readMetadata(path, function (err, metadata){
      assert.ifError(err);
      assert(metadata);
      // console.log('readMetadata(path) ->', metadata);
      done();
    });
  });

  it('should return info when called with object: {data: <raw image data>}', function(done) {
    im.readMetadata({data:imdata}, function (err, metadata){
      assert.ifError(err);
      assert(metadata);
      // console.log('readMetadata({data:imdata} ->', metadata);
      done();
    });
  });
  
});


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

