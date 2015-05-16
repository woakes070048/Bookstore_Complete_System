/**
 * Created by Vinnie on 14/05/2015.
 */
exports.mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    address: String,
    email: String,
    password: String,
    isAdmin: Boolean
});

User = mongoose.model('User', userSchema);

exports.userModel = User;