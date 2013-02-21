var fs = require('fs'),
    im = require('../imagemagick'),
    assert = require('assert');

var path = __dirname+'/sample-images/blue-bottle-coffee.jpg';
var imdata = fs.readFileSync(path, 'binary');


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

