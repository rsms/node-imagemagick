var fs = require('fs'),
    im = require('./imagemagick');

var path = __dirname + '/sample-images/flynn_pentax_645D.jpg';

var targetDirectory = __dirname + '/test-results/';
var imdata = fs.readFileSync(path, 'binary');

// from http://www.geedew.com/2012/10/24/remove-a-directory-that-is-not-empty-in-nodejs/ 
var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

deleteFolderRecursive(targetDirectory);

fs.mkdirSync(targetDirectory);

im.identify(path, function(err, features) {
    if (err) return console.error(err.stack || err);
    console.log('identify(path) ->', features);
});

im.identify({
    data: imdata
}, function(err, features) {
    if (err) return console.error(err.stack || err);
    console.log('identify({data:imdata}) ->', features);
});

im.readMetadata(path, function(err, metadata) {
    if (err) return console.error(err.stack || err);
    console.log('readMetadata(path) ->', metadata);
});

im.readMetadata({
    data: imdata
}, function(err, metadata) {
    if (err) return console.error(err.stack || err);
    console.log('readMetadata({data:imdata} ->', metadata);
});

var destResize = targetDirectory + 'test-resized.jpg';
var timeStarted = new Date();

im.resize({
    srcPath: path,
    dstPath: destResize,
    width: 256
}, function(err, stdout, stderr) {
    if (err) return console.error(err.stack || err);
    console.log('resize(...) wrote "test-resized.jpg"');
    console.log('real time taken for convert: ' + ((new Date()) - timeStarted) + ' ms');
    im.identify(['-format', '%b', destResize], function(err, r) {
        if (err) throw err;
        console.log("identify(['-format', '%b', 'test-resized.jpg']) ->", r);
    });
});

var destResizeIO = targetDirectory + 'test-resized-io.jpg';
timeStarted = new Date();

im.resize({
    srcData: imdata,
    width: 256
}, function(err, stdout, stderr) {
    if (err) return console.error(err.stack || err);
    console.log('real time taken for convert (with buffers): ' + ((new Date()) - timeStarted) + ' ms');
    fs.writeFileSync(destResizeIO, stdout, 'binary');
    console.log('resize(...) wrote "test-resized-io.jpg" (' + stdout.length + ' Bytes)');
});