//Geral para o app
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');

var multer = require('multer'); //controla arquivos

var app = express();

//seta o local das views
app.set('view engine', '.hbs');
app.set('views', __dirname + '/app/views/');

//configura o handlebars
// -- personaliza o hbs
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/app/views/layouts',
    partialsDir: __dirname + '/app/views/partials',
    registerPartials: (__dirname + '/app/views/partials'),
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

//Configurando o banco
var db = require('./config/db.js');
mongoose.connect(db.url); // conexão para o banco de dados

require('./config/passport')(passport);

//Middleware
app.set('port', process.env.PORT || 5000);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(__dirname + '/public/')); //determina o conteúdo estático
app.use(session({
    secret: 'eapoerulez',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 600000 },
    path: "/*"
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use(multer({ dest: 'uploads',
//     rename: function (fieldname, filename) {
//         return filename+"_"+Date.now();
//     },
//     onFileUploadStart: function (file) {
//         console.log(file.originalname + ' is starting ...')
//     },
//     onFileUploadComplete: function (file) {
//         console.log(file.fieldname + ' uploaded to  ' + file.path)
//         done=true;
//     }
// }));


//===============ROUTES===============
require('./app/routes/home')(app, passport);
// require('./app/routes/routes')(app, passport);
require('./app/routes/endpoint')(app, passport);
require('./app/routes/signup')(app, passport);
require('./app/routes/login')(app, passport);
require('./app/routes/facebook')(app, passport);
require('./app/routes/profile')(app, passport);
require('./app/routes/forgot')(app, passport);
require('./app/routes/logout')(app, passport);
require('./app/routes/reset')(app, passport);
require('./app/routes/user')(app, passport);
require('./app/routes/404')(app, passport);
require('./app/routes/error')(app, passport);


app.listen(app.get('port'), function () {
    console.log('Node está brincando na porta ' + app.get('port'));
});
