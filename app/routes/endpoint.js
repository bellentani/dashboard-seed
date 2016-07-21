var connect = require('../../config/connection');
var User = require('../models/user');

module.exports = function (app, passport) {
    //Verifica se o e-mail existe

    app.post('/endpoint', function (req, res) {
        var obj = {};
        // obj.email = req.body.email;
        // obj.status = 'teste';

        User.findOne({ 'local.email': req.body.email }, function (err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                doMe('email existe');
            } else {
                doMe('email livre');
            }
        });

        //This function works on Async, if we dont use it the send(obj) will be empty
        function doMe(i) {
            obj.status = i;
            obj.email = req.body.email;
            res.send(obj);
            //console.log(obj);
            //console.log('body: ' + JSON.stringify(obj), req.body.email);
        }

        //Sample to future use
        // db.collection('user').findOne({ 'local.email' : req.body.email}, function (err, doc) {
        //   if(err) throw err;
        //   if(doc) {
        //     console.log("Found: " + local.email);
        //     console.log('body: ', req.body.email);
        //     res.send(req.body);
        //   } else {
        //     console.log("Not found: " + local.email);
        //   }
        //   db.close();
        // });

    });
}