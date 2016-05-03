//Geral para o app
var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var http = require("http");
var url = require("url");

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var db = require('./config/db.js');

//Configurando o banco
mongoose.connect(db.url); // connect to our database

//Middleware
app.set('port', process.env.PORT || 5000);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'eapoerulez',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 600000 },
  path:"/*"
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
