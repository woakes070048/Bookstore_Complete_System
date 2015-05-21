var models = require('../models/index.js');

exports.getBooks = function (res) {
    models.bookModel.getBooks(function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error"});
        }

        return res.status(200).json(books);
    });
};

exports.placeOrder = function(name, address, mail, title, ISBN, price, quantity, res) {
    models.bookModel.getBookByISBN(ISBN, function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error"});
        }

        if (books[0].title != title || books[0].ISBN != ISBN || books[0].price != price) {
            return res.status(400).json({error: "Invalid book request"});
        }

        if (books[0].stock > quantity) {
            processSale(name, address, mail, title, ISBN, price, quantity);
        } else {
            createOrder(name, address, mail, title, ISBN, price, quantity);
        }
    });
};

var processSale = function (name, address, mail, title, ISBN, price, quantity, res) {
    //state: dispatch date(amanha)
    //imprimir recibo
};

var createOrder = function (name, address, mail, title, ISBN, price, quantity, res) {
    //mensagem para a queue com 10*(o que foi pedido)
    //state: waiting expedition
    //quando envia state: dispatch should occur at (depois de amanha)
};