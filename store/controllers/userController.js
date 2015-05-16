var models = require('../models/index.js');

exports.login = function (email, password, session, res) {
    models.userModel.getUserByEmail(email, function (err, user) {
        if (err) {
            return res.status(400).json({error: "Invalid Login"});
        }

        if (user.length == 0) {
            return res.status(400).json({error: "Cannot find user"});
        }

        if (user[0].password == password) {
            session.email = email;
            session.password = password;
            session.name = user[0].name;
            session.address = user[0].address
            return res.status(200).json({sucess: "Ok"});
        } else {
            return res.status(400).json({error: "Invalid password"});
        }
    });
};

exports.register = function (email, password, address, name, session, res) {
    models.userModel.getUserByEmail(email, function (err, user) {
        if (err) {
            return res.status(400).json({error: "Error in database"});
        }

        if (user.length == 0) {
            models.userModel.registerUser(email, password, address, name, function (err, user) {
                console.log(user);
                if (err) {
                    return res.status(400).json({error: "Error in database"});
                }

                if (user.length == 0) {
                    return res.status(400).json({error: "Error registering user"});
                }

                if (user.email === email) {
                    session.email = email;
                    session.password = password;
                    return res.status(200).json({sucess: "Ok"});

                } else {
                    return res.status(400).json({error: "Invalid Fields"});
                }
            });
        } else {
            return res.status(400).json({error: "User already registered"});
        }
    });
};
