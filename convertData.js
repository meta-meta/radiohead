var Converter = require("csvtojson").Converter;

require('fs').readdir('./HoC_AnimationData2_v1.0', function (err, files) {
  var toConvert = files
    .filter(function (f) {
      return f.endsWith('csv');
    });


  function next() {
    console.log('done');

    if (toConvert.length) {
      convert(toConvert.pop());
    }
  }

  function convert(f) {
    console.log('converting', f);

    var csvConverter = new Converter({noheader: true, headers: ['x', 'y', 'z', 'v'], toArrayString: true /*eol: '\n'*/});

    var readStream = require('fs').createReadStream('./HoC_AnimationData2_v1.0/' + f);

    var writeStream = require('fs').createWriteStream('./HoC_AnimationData2_v1.0/jsonData/' + f + '.json');

    readStream.pipe(csvConverter).pipe(writeStream);

    readStream.on('close', next);
  }
  
  convert(toConvert.pop());

  var int = setInterval(function() {
    console.log(toConvert.length, 'more to go');
    if(!toConvert.length) {
      clearInterval(int);
    }
  }, 5000);

});