/**
 * Created by Vinnie on 14/05/2015.
 */
mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    address: String,
    email: String,
    password: String,
    isAdmin: Boolean
});

var User = mongoose.model('User', userSchema);


User.getUserByEmail = function (email, callback) {
    User.find({email: email}, callback);
};

User.registerUser = function (email, password, address, name, callback) {
    var user = new User({name: name, address: address, email: email, password: password, isAdmin: false});

    user.save(callback);
};

exports.userModel = User;