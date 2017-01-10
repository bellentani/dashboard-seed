var lib = require('../lib');
var controllers = require('../controllers');

var excluded = ['index'];
var validFileTypes  = ['js'];

function requireFiles(directory, app, passport) {
  lib.fs.readdirSync(directory).map(function (fileName) {
    // Recurse if directory
    if(lib.fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      return requireFiles(directory + '/' + fileName, app, passport);

    }
    // Skip this file
    if(fileName === 'routes.js' && directory === __dirname) return;
    // Skip unknown filetypes
    if(validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;
    // Require the file.
    require(directory + '/' + fileName)(app, passport);
  });
};

module.exports = function(app, passport) {
  requireFiles(__dirname, app, passport);

  //Error 404
  app.use(function(req, res, next) {
    res.status(404).render('404.hbs'); // load the index.handlebars file
  });

  //Error com server
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('500.hbs', err);
  });
}
