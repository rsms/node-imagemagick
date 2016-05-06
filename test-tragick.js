var fs = require('fs');
var im = require('./imagemagick');

// this is a malicious png file (actually an mvg) demonstrating
// one of the imagetragick vulnerabilities (CVE-2016–3714).
// when passed to a vulnerable version of imagemagick's `identify` or
// `convert` command line tool, it will create a file (touch) named `rce1`.
// for more information see: https://imagetragick.com/
var path = __dirname + '/sample-images/imagetragick_rce1.png';
var pocFile = __dirname + '/rce1';

fs.unlink(pocFile, function () {
  im.identify(path, function (err, features) {
    fs.exists(pocFile, function (exists) {
      if (exists) {
        console.log('Bad news! Exploit worked!');
        fs.unlink(pocFile, function () {
          console.log('Cleaned up!');
        });
      } else {
        console.log('Good news! Exploit failed!');
      }
    });
  });
});
