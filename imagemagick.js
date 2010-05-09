var sys = require('sys'),
    exec2 = require('child_process').execFile;

exports.identify = function(pathOrArgs, callback) {
  var isCustom = Array.isArray(pathOrArgs),
      args = isCustom ? pathOrArgs : [pathOrArgs];
  exec2(exports.identify.path, args, function(err, stdout, stderr) {
    var result;
    if (!err) {
      if (isCustom) {
        result = stdout;
      } else {
        var v = stdout.split(/ +/),
            x = v[2].split(/x/);
        result = {
          format: v[1],
          width: parseInt(x[0]),
          height: parseInt(x[1]),
          depth: parseInt(v[4]),
        };
      }
    }
    callback(err, result);
  });
}
exports.identify.path = 'identify';

function ExifDate(value) {
  // YYYY:MM:DD HH:MM:SS -> Date(YYYY-MM-DD HH:MM:SS +0000)
  value = value.split(/ /);
  return new Date(value[0].replace(/:/g, '-')+' '+
    value[1]+' +0000');
}

function exifKeyName(k) {
  return k.replace(exifKeyName.RE, function(x){
    if (x.length === 1) return x.toLowerCase();
    else return x.substr(0,x.length-1).toLowerCase()+x.substr(x.length-1);
  });
}
exifKeyName.RE = /^[A-Z]+/;

var exifFieldConverters = {
  // Numbers
  bitsPerSample:Number, compression:Number, exifImageLength:Number,
  exifImageWidth:Number, exifOffset:Number, exposureProgram:Number,
  flash:Number, imageLength:Number, imageWidth:Number, isoSpeedRatings:Number,
  jpegInterchangeFormat:Number, jpegInterchangeFormatLength:Number,
  lightSource:Number, meteringMode:Number, orientation:Number,
  photometricInterpretation:Number, planarConfiguration:Number,
  resolutionUnit:Number, rowsPerStrip:Number, samplesPerPixel:Number,
  sensingMethod:Number, stripByteCounts:Number, subSecTime:Number,
  subSecTimeDigitized:Number, subSecTimeOriginal:Number, customRendered:Number,
  exposureMode:Number, focalLengthIn35mmFilm:Number, gainControl:Number,
  saturation:Number, sharpness:Number, subjectDistanceRange:Number,
  subSecTime:Number, subSecTimeDigitized:Number, subSecTimeOriginal:Number,
  whiteBalance:Number, sceneCaptureType:Number,
  
  // Dates
  dateTime:ExifDate, dateTimeDigitized:ExifDate, dateTimeOriginal:ExifDate
};

exports.readMetadata = function(path, callback) {
  exec2(exports.identify.path, ['-format', '%[EXIF:*]', path], function(err, stdout, stderr) {
    var meta = {};
    if (!err) {
      stdout.split(/\n/).forEach(function(line){
        var eq_p = line.indexOf('=');
        if (eq_p === -1) return;
        var key = line.substr(0, eq_p).replace('/','-'),
            value = line.substr(eq_p+1).trim(),
            typekey = 'default';
        var p = key.indexOf(':');
        if (p !== -1) {
          typekey = key.substr(0, p);
          key = key.substr(p+1);
          if (typekey === 'exif') {
            key = exifKeyName(key);
            var converter = exifFieldConverters[key];
            if (converter) value = converter(value);
          }
        }
        if (!(typekey in meta)) meta[typekey] = {key:value};
        else meta[typekey][key] = value;
      })
    }
    callback(err, meta);
  });
}

exports.convert = function(args, callback) {
  exec2(exports.convert.path, args, callback);
}
exports.convert.path = 'convert';

exports.resize = function(options, callback) {
  var args = exports.resizeArgs(options);
  exports.convert(args, function(err, stdout, stderr) {
    callback(err, stdout, stderr);
  });
}

exports.resizeArgs = function(options) {
  var opt = {
    srcPath: undefined,
    dstPath: undefined,
    quality: 0.8,
    format: 'jpg',
    progressive: false,
    colorspace: 'sRGB', // if null, no conversion is made
    width: 0,
    height: 0,
    strip: true,
    filter: 'Lagrange',
    sharpening: 0.2,
    customArgs: []
  }

  // check options
  if (typeof options !== 'object')
    throw new Error('first argument must be an object');
  for (var k in opt) if (k in options) opt[k] = options[k];
  if (!opt.srcPath || !opt.dstPath)
    throw new Error('srcPath or dstPath is not set');
  if (opt.width === 0 && opt.height === 0)
    throw new Error('both width and height can not be 0 (zero)');

  // build args
  var args = [opt.srcPath];
  if (opt.sharpening > 0) {
    args = args.concat([
      '-set', 'option:filter:blur', String(1.0-opt.sharpening)]);
  }
  if (opt.filter) {
    args.push('-filter');
    args.push(opt.filter);
  }
  if (opt.strip) {
    args.push('-strip');
  }
  if (opt.width || opt.height) {
    if (opt.height === 0) opt.height = opt.width;
    else if (opt.width === 0) opt.width = opt.height;
    args.push('-resize');
    args.push(String(opt.width)+'x'+String(opt.height));
  }
  opt.format = opt.format.toLowerCase();
  var isJPEG = (opt.format === 'jpg' || opt.format === 'jpeg');
  if (isJPEG && opt.progressive) {
    args.push('-interlace');
    args.push('plane');
  }
  if (isJPEG || opt.format === 'png') {
    args.push('-quality');
    args.push(Math.round(opt.quality * 100.0).toString());
  }
  else if (opt.format === 'miff' || opt.format === 'mif') {
    args.push('-quality');
    args.push(Math.round(opt.quality * 9.0).toString());
  }
  if (opt.colorspace) {
    args.push('-colorspace');
    args.push(opt.colorspace);
  }
  if (Array.isArray(opt.customArgs) && opt.customArgs.length)
    args = args.concat(opt.customArgs);
  args.push(opt.dstPath);

  return args;
}
