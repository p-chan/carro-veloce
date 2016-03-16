const fs = require('fs');
const stylus = require('stylus');
const cv = require('../');

var cases = fs.readdirSync('test/cases').filter(function(file){
  return ~file.indexOf('.styl');
}).map(function(file){
  return file.replace('.styl', '');
});

describe('Integration', function() {
  cases.forEach(function(test) {
    const name = test;
    it(name, function() {
      const path = `test/cases/${test}.styl`;
      const styl = fs.readFileSync(path, 'utf8').replace(/\r/g, '');
      const css = fs.readFileSync(`test/cases/${test}.css`, 'utf8').replace(/\r/g, '').trim();

      const style = stylus(styl)
        .use(cv())
        .set('filename', path)
        .define('url', stylus.url());

      if (~test.indexOf('compress')) style.set('compress', true);

      style.render(function(err, actual) {
        if (err) throw err;
        actual.trim().should.equal(css);
      });
    });
  });
});
