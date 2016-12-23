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

var connect = require('../../config/connection');
var User = require('../models/user');

module.exports = function(app, passport) {

  //Perfil do usuário - pessoal
  app.get('/profile/', isLoggedIn, function(req, res) {
    avatarUser(req, res, req.user, req.user, 'profile');
  });

  //Perfil do usuário - pessoal
  app.get('/profile/edit', isLoggedIn, function(req, res) {
    avatarUser(req, res, req.user, req.user, 'profile_edit');
  });
  app.post('/profile/edit', function(req, res) {
    // Update User
    User.findById(req.user.id, function(error, user) {
        if (error) {
          req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro. ' + error);
          res.send(error);
        }

        user.name = req.body.name;  // update the user info
        user.local.email = req.body.email;
        user.alias = req.body.alias;
        user.resume = req.body.resume;
        if (req.body.email) {
          // save user
          user.save(function(error) {
            if (error) {
              req.flash('error', 'Ops, tivemos um problemas em atualizar seu cadastro.');
              //res.send(error);
            }
            req.flash('success', 'usuário atualizado');
            res.redirect('/profile/edit');
          });
        } else {
          req.flash('error', 'O e-mail não pode ser vazio');
          res.redirect('/profile/edit');
        }

    });
    console.log(req.body);
  });

  //Editar profile
  app.get('/profile/edit/avatar',isLoggedIn, function(req,res) {
    avatarUser(req, res, req.user, req.user, 'profile_edit');
  });
  app.post('/profile/edit/avatar', function(req,res){
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
    var uploader = multer({ storage : upload}).single('avatarEdit');
    uploader(req,res,function(err) {
        if(err) {
          req.flash('error', 'Houve algum problema em subir seu arquivo.');
          //return res.end("Error uploading file.");
        }
        console.log(req.file);

        //crop-img
        var srcPath = __dirname+'/../../public/uploads/avatar/temp/' + req.file.filename;
        var dstPath = __dirname+'/../../public/uploads/avatar/' + req.file.filename;
        //fs.unlinkSync(srcPath);
        //console.log(srcPath, dstPath);


        User.findById(req.user.id, function(err, user) {
            if (err) {
              req.flash('error', 'Tivemos um problema em encontrar o seu avatar.');
              //res.send(err);
            }
            user.avatar = '/uploads/avatar/' + req.file.filename;  // update the user info
            // save user
            user.save(function(err) {
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

  //Function to load user with avatar
  function avatarUser(req, res, userView, userLogged, renderView) {
    //a definição da variávei user altera o local que ele lê,
    //se vier como req.user quer dizer que vai pegar a seção do USUARIO LOGADO na roda /profile
    //se vier como user é do usuário sendo consultado no banco pela rota user/:id
    var options = {
      email: userView.local.email,
      parameters: { 'size': '200', 'd': '404'}, //https://localhost:5000/img/avatares/'+randomAvatar(1, 17)+'.png
      secure: true
    }
    var hasAvatar = userView.avatar;
    var avatar = gravatar.imageUrl(options);
    //verifica se tem avatar cadastrado
    if (hasAvatar == '' || hasAvatar == null) {
      request({uri:avatar}, function (error, response) {
        //verificar se o gravatar existe - se ele não existe vai retornar 404 devido ao parametro passado ao api
        if (!error && response.statusCode == 200) {
          //se o gravatar existe, então avatar é igual a url dele
          avatar = avatar;
        } else if (!error && response.statusCode == 404) {
          //se não existe, o avatar será o coelho (por enquanto). :P
          avatar = '/img/avatares/6.png';
        }
        //o sender tem que ser depois que o request for feito, senão não pega a variável --> Oláááá, callback hell!
        res.render(renderView, {
          userView: userView,
          userLogged: userLogged,
          avatar: avatar,
          message: req.flash()
        });
        //console.log(response.statusCode);
      });
    } else {
      //Nesse caso já tem avatar cadastrado, por personalização, portanto, não precisa do gravatar
      avatar = hasAvatar;
      //o sender tem que ser depois que o request for feito, senão não pega a variável --> Oláááá, callback hell!
      res.render(renderView, {
        userView: userView,
        userLogged: userLogged,
        avatar: avatar,
        message: req.flash()
      });
    }
  }

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
