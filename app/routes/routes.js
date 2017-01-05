var path = require('path');
var fs = require('fs');
var async = require('async');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var flash    = require('connect-flash');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var multer = require('multer'); //controla arquivos

var request = require('request'); // trata request
var gravatar = require('gravatar-api'); //load gravatar

//var im = require('imagemagick'); //opcional

var controllers = require('../controllers');

// var connect = require('../../config/connection');
var User = require('../models/user');

/*
Artigos que estamos usando como referência para configuração inicial:
http://www.peachpit.com/articles/article.aspx?p=2252193&seqNum=4
https://scalegrid.io/blog/getting-started-with-mongodb-and-mongoose/
https://scotch.io/tutorials/easy-node-authentication-setup-and-local
http://mongoosejs.com/docs/models.html
*/

//setup Routes --> http://billpatrianakos.me/blog/2015/12/01/organizing-express-routes/
var excluded = ['routes'];
var validFileTypes  = ['js'];

var requireFiles = function (directory, app, passport) {
  fs.readdirSync(directory).forEach(function (fileName) {
    // Recurse if directory
    if(fs.lstatSync(directory + '/' + fileName).isDirectory()) {
      requireFiles(directory + '/' + fileName, app, passport);
    } else {
      // Skip this file
      if(fileName === 'routes.js' && directory === __dirname) return;
      // Skip unknown filetypes
      if(validFileTypes.indexOf(fileName.split('.').pop()) === -1) return;
      // Require the file.
      require(directory + '/' + fileName)(app, passport);
    }
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

  // //Main page
  // app.get('/', function(req, res){
  //   if (req.isAuthenticated()) {
  //     res.redirect('/profile');
  //     //por enquanto redirecionando para o profile, mas irá ter uma home
  //     //com o resumo das atividades do usuário, como se fosse um dashboard mesmo
  //     //avatarUser(req, res, req.user, req.user, 'profile');
  //   } else {
  //     res.render('index', {
  //       title: 'Dashboard Seed',
  //       user: req.user,
  //       message: req.flash('loginMessage')
  //     });
  //   }
  // });
  //
  // //Signup
  // app.get('/signup', function(req, res){
  //   res.render('signup', {
  //     title: 'Cadastre-se',
  //     user: req.user,
  //     message: req.flash('signupMessage')
  //   });
  // });
  //
  // app.post('/signup', function(req, res) {
  //
  //     req.check('signup_email', 'E-mail inválido').isEmail();
  //     req.check('signup_password', 'A senha precisa ter mais que 4 caracteres').isLength({min: 4});
  //     req.check('signup_password', 'As senhas não são iguais').equals(req.body.confirm_password);
  //
  //     var errors = req.validationErrors(true); //colocar (true) para transformar em objeto
  //
  //     if (errors) {
  //       req.session.errors = errors;
  //       req.session.success = false;
  //       res.render('signup', {user:null, errors:errors});
  //       console.log(errors);
  //       req.flash('error', errors);
  //     } else {
  //       passport.authenticate('local-signup', {
  //         successRedirect : '/profile', // redirect to the secure profile section
  //         failureRedirect : '/signup', // redirect back to the signup page if there is an error
  //         failureFlash : true // allow flash messages
  //       })(req, res);
  //     }
  //   }
  // );
  //
  // //Verifica se o e-mail existe
  // app.post('/endpoint', function(req, res){
  //   var obj = {};
  //   // obj.email = req.body.email;
  //   // obj.status = 'teste';
  //
  //   User.findOne({ 'local.email' :  req.body.email }, function(err, user) {
  //     // if there are any errors, return the error
  //     if (err)
  //       return done(err);
  //
  //     // check to see if theres already a user with that email
  //     if (user) {
  //       doMe('email existe');
  //     } else {
  //       doMe('email livre');
  //     }
  //   });
  //
  //   //This function works on Async, if we dont use it the send(obj) will be empty
  //   function doMe(i) {
  //     obj.status = i;
  //     obj.email = req.body.email;
  //     res.send(obj);
  //     //console.log(obj);
  //     //console.log('body: ' + JSON.stringify(obj), req.body.email);
  //   }
  //
  //   //Sample to future use
  //   // db.collection('user').findOne({ 'local.email' : req.body.email}, function (err, doc) {
  //   //   if(err) throw err;
  //   //   if(doc) {
  //   //     console.log("Found: " + local.email);
  //   //     console.log('body: ', req.body.email);
  //   //     res.send(req.body);
  //   //   } else {
  //   //     console.log("Not found: " + local.email);
  //   //   }
  //   //   db.close();
  //   // });
  //
  // });
  //
  // // =====================================
  // // FACEBOOK ROUTES =====================
  // // =====================================
  // // route for facebook authentication and login
  // app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
  //
  // // handle the callback after facebook has authenticated the user
  // app.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', { failureRedirect: '/' }),
  //   function(req, res) {
  //     // Successful authentication, redirect home.
  //     res.redirect('/profile');
  //   });
  //
  // app.post('/login', passport.authenticate('local-login', {
  //     successRedirect : '/profile', // redirect to the secure profile section
  //     failureRedirect : '/', // redirect back to the signup page if there is an error
  //     failureFlash : true // allow flash messages
  //   })
  // );
  //
  // //Perfil do usuário - pessoal
  // app.get('/profile/', isLoggedIn, function(req, res) {
  //   avatarUser(req, res, req.user, req.user, 'profile');
  //
  //   // Random script
  //   // var userAvatar = req.user.avatar;
  //   // if (userAvatar == '') {
  //   //   avatar = '/img/avatares/'+randomAvatar(1, 17)+'.png';
  //   // }
  //   // function randomAvatar(min, max) {
  //   //   return ~~(Math.random() * (max - min + 1)) + min
  //   // }
  //
  //   //console.log(avatar, options.email);
  //   //
  //   // res.render('profile', {
  //   //     user: req.user,
  //   //     avatar: avatar
  //   // });
  // });
  //
  // //Perfil do usuário - pessoal
  // app.get('/profile/edit', isLoggedIn, function(req, res) {
  //   avatarUser(req, res, req.user, req.user, 'profile_edit');
  // });
  //
  // //Perfil do usuário - pessoal
  // app.post('/profile/edit', function(req, res) {
  //   // Update User
  //   User.findById(req.user.id, function(error, user) {
  //       if (error) {
  //         req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro. ' + error);
  //         res.send(error);
  //       }
  //
  //       user.name = req.body.name;  // update the user info
  //       user.local.email = req.body.email;
  //       user.alias = req.body.alias;
  //       user.resume = req.body.resume;
  //       if (req.body.email) {
  //         // save user
  //         user.save(function(error) {
  //           if (error) {
  //             req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro.');
  //             //res.send(error);
  //           }
  //           req.flash('success', 'usuário atualizado');
  //           res.redirect('/profile/edit');
  //         });
  //       } else {
  //         req.flash('error', 'O e-mail não pode ser vazio');
  //         res.redirect('/profile/edit');
  //       }
  //
  //   });
  //   console.log(req.body);
  // });
  //
  // //test crop
  // app.get('/imagecrop', function(req, res) {
  //   var path = __dirname+'/../../public/img/avatar-sample.jpg';
  //   var destPath = __dirname+'/../../public/uploads/avatar/cropped/cropped.jpg';
  //   im.identify(path, function(err, features){
  //     if (err) throw err;
  //     console.log(features);
  //     // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
  //   });
  //   im.crop({
  //     srcPath: path,
  //     dstPath: destPath,
  //     width: 40,
  //     height: 40,
  //     quality: 1,
  //     gravity: 'North'
  //   }, function(err, stdout, stderr){
  //     if (err) throw err;
  //     //console.log(stdout, stderr);
  //   });
  //   res.render('test', {
  //     title: 'Teste imagem',
  //     user: req.user,
  //     message: req.flash()
  //   });
  // });
  // app.post('/imagecrop', function(req, res) {
  //
  //   //crop-img
  //   im.readMetadata('/public/img/avatar-sample.png', function(err, metadata){
  //     if (err) {
  //       throw err;
  //     }
  //     console.log('Shot at '+metadata.exif.dateTimeOriginal);
  //
  //     res.render('test', {
  //       title: 'Teste imagem',
  //       user: req.user,
  //       message: req.flash()
  //     });
  //   })
  // });
  //
  // app.get('/profile/edit/avatar',isLoggedIn, function(req,res) {
  //   avatarUser(req, res, req.user, req.user, 'profile_edit');
  // });
  // app.post('/profile/edit/avatar', function(req,res){
  //   var upload = multer.diskStorage({
  //     destination: function (req, file, callback) {
  //       callback(null, 'public/uploads/avatar');
  //     },
  //     filename: function (req, file, callback) {
  //       crypto.pseudoRandomBytes(16, function (err, raw) {
  //         callback(null, raw.toString('hex') + Date.now());
  //       });
  //     }
  //   });
  //   var uploader = multer({ storage : upload}).single('avatarEdit');
  //   uploader(req,res,function(err) {
  //       if(err) {
  //         req.flash('error', 'Houve algum problema em subir seu arquivo.');
  //         //return res.end("Error uploading file.");
  //       }
  //       console.log(req.file);
  //
  //       //crop-img
  //       var srcPath = __dirname+'/../../public/uploads/avatar/temp/' + req.file.filename;
  //       var dstPath = __dirname+'/../../public/uploads/avatar/' + req.file.filename;
  //       //fs.unlinkSync(srcPath);
  //       //console.log(srcPath, dstPath);
  //
  //
  //       User.findById(req.user.id, function(err, user) {
  //           if (err) {
  //             req.flash('error', 'Tivemos um problema em encontrar o seu avatar.');
  //             //res.send(err);
  //           }
  //           user.avatar = '/uploads/avatar/' + req.file.filename;  // update the user info
  //           // save user
  //           user.save(function(err) {
  //               if (err) {
  //                 req.flash('error', 'Houve um problema enviando seu avatar.');
  //                 //res.send(err);
  //               }
  //
  //               res.redirect('/profile/edit');
  //               req.flash('success', 'usuário atualizado');
  //           });
  //       });
  //   });
  //   //adicionar arquivos
  //   //https://www.terlici.com/2015/05/16/uploading-files-locally.html
  //   //http://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
  //   //http://stackoverflow.com/questions/5294470/writing-image-to-local-server
  //   //http://stackoverflow.com/questions/16860334/how-to-load-and-save-image-using-node-js
  // });
  //
  // //Perfil do usuário - pessoal
  // app.get('/user/:alias', function(req, res) {
  // //app.get('/user/', isLoggedIn, function(req, res) { exemplo de função que checa se está logado
  //
  //   User.findOne({ alias: req.params.alias}, function(err, user) {
  //     if (!user) {
  //       req.flash('error', 'Usuário não existe');
  //       return res.redirect('/');
  //     }
  //     //console.log(user.local.email)
  //     avatarUser(req, res, user, req.user, 'profile');
  //   });
  //
  // });
  //
  // //Function to load user with avatar
  // function avatarUser(req, res, userView, userLogged, renderView) {
  //   //a definição da variávei user altera o local que ele lê,
  //   //se vier como req.user quer dizer que vai pegar a seção do USUARIO LOGADO na roda /profile
  //   //se vier como user é do usuário sendo consultado no banco pela rota user/:id
  //   var options = {
  //     email: userView.local.email,
  //     parameters: { 'size': '200', 'd': '404'}, //https://localhost:5000/img/avatares/'+randomAvatar(1, 17)+'.png
  //     secure: true
  //   }
  //   var hasAvatar = userView.avatar;
  //   var avatar = gravatar.imageUrl(options);
  //   //verifica se tem avatar cadastrado
  //   if (hasAvatar == '' || hasAvatar == null) {
  //     request({uri:avatar}, function (error, response) {
  //       //verificar se o gravatar existe - se ele não existe vai retornar 404 devido ao parametro passado ao api
  //       if (!error && response.statusCode == 200) {
  //         //se o gravatar existe, então avatar é igual a url dele
  //         avatar = avatar;
  //       } else if (!error && response.statusCode == 404) {
  //         //se não existe, o avatar será o coelho (por enquanto). :P
  //         avatar = '/img/avatares/6.png';
  //       }
  //       //o sender tem que ser depois que o request for feito, senão não pega a variável --> Oláááá, callback hell!
  //       res.render(renderView, {
  //         userView: userView,
  //         userLogged: userLogged,
  //         avatar: avatar,
  //         message: req.flash()
  //       });
  //       //console.log(response.statusCode);
  //     });
  //   } else {
  //     //Nesse caso já tem avatar cadastrado, por personalização, portanto, não precisa do gravatar
  //     avatar = hasAvatar;
  //     //o sender tem que ser depois que o request for feito, senão não pega a variável --> Oláááá, callback hell!
  //     res.render(renderView, {
  //       userView: userView,
  //       userLogged: userLogged,
  //       avatar: avatar,
  //       message: req.flash()
  //     });
  //   }
  // }
  //
  //
  // //Logout
  // app.get('/logout', function(req, res) {
  //   req.logout();
  //   res.redirect('/');
  // });
  //
  // //reset password
  // //Using base http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
  // app.get('/forgot', function(req, res) {
  //   res.render('forgot', {
  //     user: req.user,
  //     message: req.flash()
  //   });
  // });
  //
  // app.post('/forgot', function(req, res, next) {
  //   async.waterfall([
  //     function(done) {
  //       crypto.randomBytes(20, function(err, buf) {
  //         var token = buf.toString('hex');
  //         done(err, token);
  //       });
  //     },
  //     function(token, done) {
  //       User.findOne({ 'local.email': req.body.email }, function(err, user) {
  //         if (!user) {
  //           req.flash('error', 'No account with that email address exists.');
  //           return res.redirect('/forgot');
  //         }
  //
  //         user.resetPasswordToken = token;
  //         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  //
  //         user.save(function(err) {
  //           done(err, token, user);
  //         });
  //       });
  //     },
  //     function(token, user, done) {
  //       var connection = {
  //           host: 'smtp.gmail.com',
  //           port: 465,
  //           secure: true, // use SSL
  //           auth: {
  //               user: connect.user,
  //               pass: connect.pass
  //           }
  //       };
  //       var transporter = nodemailer.createTransport(connection);
  //
  //       var mailOptions = {
  //         to: user.local.email,
  //         from: 'passwordreset@demo.com',
  //         subject: 'Recuperação de senha Dashboard Node',
  //         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
  //           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
  //           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
  //           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  //       };
  //
  //       transporter.sendMail(mailOptions, function(err) {
  //         req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
  //         done(err, 'done');
  //       });
  //     }
  //   ], function(err) {
  //     if (err) return next(err);
  //     res.redirect('/forgot');
  //   });
  // });
  //
  // app.get('/reset/:token', function(req, res) {
  //   User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  //     if (!user) {
  //       req.flash('error', 'Password reset token is invalid or has expired.');
  //       return res.redirect('/forgot');
  //     }
  //     res.render('reset', {
  //       user: req.user,
  //       show: 'true'
  //     });
  //   });
  // });
  //
  // app.post('/reset/:token', function(req, res) {
  //   async.waterfall([
  //     function(done) {
  //       User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  //         if (!user) {
  //           req.flash('error', 'Password reset token is invalid or has expired.');
  //           return res.redirect('back');
  //         }
  //
  //         user.password = req.body.password;
  //         user.resetPasswordToken = undefined;
  //         user.resetPasswordExpires = undefined;
  //
  //         user.save(function(err) {
  //           req.logIn(user, function(err) {
  //             done(err, user);
  //           });
  //         });
  //       });
  //     },
  //     function(user, done) {
  //       var connection = {
  //           host: 'smtp.gmail.com',
  //           port: 465,
  //           secure: true, // use SSL
  //           auth: {
  //             user: connect.user,
  //             pass: connect.pass
  //           }
  //       };
  //       var transporter = nodemailer.createTransport(connection);
  //       var mailOptions = {
  //         to: user.local.email,
  //         from: 'passwordreset@demo.com',
  //         subject: 'Sua senha foi reiniciada com sucesso',
  //         text: 'Olá,\n\n' +
  //           'Essa é a confirmação que sua senha para a conta ' + user.local.email + ' foi modificada.\n'
  //       };
  //       transporter.sendMail(mailOptions, function(err) {
  //         req.flash('success', 'Success! Your password has been changed.');
  //         done(err);
  //       });
  //     }
  //   ], function(err) {
  //     res.redirect('/profile');
  //   });
  // });
  //
  //
  // //Error 404
  // app.use(function(req, res, next) {
  //   res.status(404).render('404.hbs'); // load the index.handlebars file
  // });
  //
  // //Error com server
  // app.use(function(err, req, res, next) {
  //   console.error(err.stack);
  //   res.status(500).render('500.hbs', err);
  // });
}
