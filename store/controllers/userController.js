var models = require('../models/index.js');

exports.login = function (email, password, session, res) {
    models.userModel.getUserByEmail(email, function (err, user) {
        console.log(user);
        if (err) {
            res.status(400).json({error: "Invalid Login"});
        }

        if (!user) {
            res.status(400).json({error: "Cannot find user"});
        }

        if (user.password === password) {
            session.email = email;
            session.password = password;
            res.status(200).json({sucess: "Ok"});
        } else {
            res.status(400).json({error: "Invalid password"});
        }
    });
};

exports.register = function(email, password, address, name) {
    models.userModel.getUserByEmail(email, function(err, user) {
        if (err) {
            res.status(400).json({error: "Error in database"});
        }

        if (!user) {
            models.userModel.registerUser(email, password, address, name, function (err, user) {
                if (err) {
                    res.status(400).json({error: "Error in database"});
                }

                if (!user) {
                    res.status(400).json({error: "Error registering user"});
                }

                if (user.email === email) {
                    res.status(200).json({sucess: "Ok"});
                } else {
                    res.status(400).json({error: "Invalid Fields"});
                }
            });
        } else {
            res.status(400).json({error: "User already registered"});
        }
    });
};
