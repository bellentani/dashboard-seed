var funcoes = require('../controllers/index');
var User = require('../models/user');
var async =  require('async');

module.exports = function (app, passport) {

    app.get('/profile/', funcoes.isLoggedIn, function (req, res) {
        funcoes.avatarUser(req, res, req.user, req.user, 'profile');

        // Random script
        // var userAvatar = req.user.avatar;
        // if (userAvatar == '') {
        //   avatar = '/img/avatares/'+randomAvatar(1, 17)+'.png';
        // }
        // function randomAvatar(min, max) {
        //   return ~~(Math.random() * (max - min + 1)) + min
        // }

        //console.log(avatar, options.email);
        //
        // res.render('profile', {
        //     user: req.user,
        //     avatar: avatar
        // });
    });

    //Perfil do usuário - pessoal
    app.get('/profile/edit', funcoes.isLoggedIn, function (req, res) {
        funcoes.avatarUser(req, res, req.user, req.user, 'profile_edit');
    });

    //Perfil do usuário - pessoal
    app.post('/profile/edit', function (req, res) {

      req.checkBody('email', 'O e-mail não pode ser vazio').notEmpty();
      req.checkBody('email', 'E-mail inválido').isEmail();
      req.checkBody('alias', 'O alias não pode ser vazio').notEmpty();
      var errors = req.validationErrors(); //colocar (true) para transformar em objeto
      if (errors) {
        req.flash('error', errors[0].msg); // primeira mensagem de erro
        return res.redirect('/profile/edit');
      }

      async.waterfall([
        function(done){
          User.findById(req.user.id, function (error, user) {
            if( error || user === null ) { return done(error) }
            else { return done(null,user) }
          });
        },
        function(user,done){
          if( user.local.email !== req.body.email ){
              User.findOne({ 'local.email':req.body.email }, function (error, email) {
                if(error) {
                  return done(error);
                }
                if(email){
                  req.flash('error','E-mail já está em uso.');
                  return res.redirect('/profile/edit');
                }
                else {
                  return done(null,user);
                }
              });
          } else {
            return done(null,user);
          }
        },
        function(user,done){
          if( user.alias !== req.body.alias ){
              User.findOne({ alias:req.body.alias }, function (error, alias) {
                if(error) {
                  return done(error);
                }
                if(alias){
                  req.flash('error','Alias já está em uso.');
                  return res.redirect('/profile/edit');
                }
                else {
                  return done(null,user);
                }
              });
          } else {
            return done(null,user);
          }
        },
        function(user,done){
          user.name = req.body.name;  // update the user info
          user.local.email = req.body.email;
          user.alias = req.body.alias;
          user.resume = req.body.resume;

          // save user
          user.save(function (error) {
            if (error) {
              console.log(error);
              return done(error);
            }
            console.log(req.body);
            req.flash('success', 'usuário atualizado');
            return res.redirect('/profile/edit');
            done();
          });
        }
      ],function(error){
        if (error) {
            req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro.');
            return res.redirect('/profile/edit');
        }
      });
    });

    app.get('/profile/edit/avatar', funcoes.isLoggedIn, function (req, res) {
        funcoes.avatarUser(req, res, req.user, req.user, 'profile_edit');
    });

    app.post('/profile/edit/avatar', function (req, res) {
        var upload = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, 'public/uploads/avatar');
            },
            filename: function (req, file, callback) {
                crypto.pseudoRandomBytes(16, function (err, raw) {
                    callback(null, raw.toString('hex') + Date.now());
                });
            }
        });
        var uploader = multer({ storage: upload }).single('avatarEdit');
        uploader(req, res, function (err) {
            if (err) {
                req.flash('error', 'Houve algum problema em subir seu arquivo.');
                //return res.end("Error uploading file.");
            }
            console.log(req.file);

            User.findById(req.user.id, function (err, user) {
                if (err) {
                    req.flash('error', 'Tivemos um problema em encontrar o seu avatar.');
                    //res.send(err);
                }

                user.avatar = '/uploads/avatar/' + req.file.filename;  // update the user info

                // save user
                user.save(function (err) {
                    if (err) {
                        req.flash('error', 'Houve um problema enviando seu avatar.');
                        //res.send(err);
                    }

                    res.redirect('/profile/edit');
                    req.flash('success', 'usuário atualizado');
                });
            });
        });
        //adicionar arquivos
        //https://www.terlici.com/2015/05/16/uploading-files-locally.html
        //http://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
        //http://stackoverflow.com/questions/5294470/writing-image-to-local-server
        //http://stackoverflow.com/questions/16860334/how-to-load-and-save-image-using-node-js
    });
}
