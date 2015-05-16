/**
 * Created by Vinnie on 14/05/2015.
 */
exports.mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    title: String,
    author: String,
    edition: String,
    publisher: Date,
    ISBN: String,
    language: String,
    nPages: Number,
    price: Number
});

Book = mongoose.model('Book', bookSchema);

exports.bookModel = Book;