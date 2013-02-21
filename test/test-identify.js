var fs = require('fs'),
    im = require('../imagemagick'),
    assert = require('assert');

var path = __dirname+'/fixtures/blue-bottle-coffee.jpg';
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

