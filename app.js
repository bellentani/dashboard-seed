//Geral para o app
var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

//Middleware
app.set('port', process.env.PORT || 5000);

//configura o handlebars
// -- personaliza o hbs
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir:__dirname +'/app/views/layouts',
    partialsDir:__dirname +'/app/views/partials',
    registerPartials:(__dirname + '/app/views/partials'),
    helpers: {
      ifCond: function (v1, operator, v2, options) {
        switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
        }
      }
    }
}));

//seta o local das views
app.set('view engine', '.hbs');
app.set('views', __dirname + '/app/views/');

//determina o conteúdo estático
app.use(express.static(__dirname + '/public/'));

//===============ROUTES===============
require('./app/routes/routes')(app);


app.listen(app.get('port'), function() {
  console.log('Node está brincando na porta ' + app.get('port'));
});
