var request = require('request');
var gravatar = require('gravatar-api'); //load gravatar

module.exports.controller = function() {
    avatarUser: function avatarUser(req, res, userView, userLogged, renderView) {
        //a definição da variávei user altera o local que ele lê,
        //se vier como req.user quer dizer que vai pegar a seção do USUARIO LOGADO na roda /profile
        //se vier como user é do usuário sendo consultado no banco pela rota user/:id
        var options = {
            email: userView.local.email,
            parameters: { 'size': '200', 'd': '404' }, //https://localhost:5000/img/avatares/'+randomAvatar(1, 17)+'.png
            secure: true
        }
        var hasAvatar = userView.avatar;
        var avatar = gravatar.imageUrl(options);
        //verifica se tem avatar cadastrado
        if (hasAvatar == '' || hasAvatar == null) {
            request({ uri: avatar }, function (error, response) {
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
    },
    isLoggedIn: function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
};
