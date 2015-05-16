var models = require('../models/index.js');

exports.getBooks = function (res) {
    models.bookModel.getBooks(function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error"});
        }

        return res.status(200).json(books);
    });
};