var moment = require('moment');
var models = require('../models/index.js');

exports.getBooks = function (res) {
    models.bookModel.getBooks(function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        return res.status(200).json(books);
    });
};

exports.placeOrder = function(name, address, mail, title, ISBN, price, quantity, res) {
    models.bookModel.getBookByISBN(ISBN, function (err, books) {
        if (err) {
            return res.status(400).json({error: "Database error"} + err);
        }
        if (books[0].title != title || books[0].ISBN != ISBN || books[0].price != price) {
            return res.status(400).json({error: "Invalid book request"});
        }
        models.orderModel.addOrder(name, address, mail, title, ISBN, price, quantity, moment().format(), price * quantity, "null", function (err, order) {
            if (err) {
                return res.status(400).json({error: "Database error" + err});
            }
            if (books[0].stock > quantity && order != undefined) {
                var state = "Dispatched at " + (moment().add(1, 'days')).format();
                console.log(state);
                processSale(order._id, state, res);
            } else if (order != undefined) {
                var state = "Waiting expedition";
                console.log(state);
                createOrder(order._id, order.book.ISBN, order.quantity, state, res);
            }
        });
    });
};

var processSale = function (objectID, state, res) {
    //state: dispatch date(amanha)
    //imprimir recibo
    models.orderModel.updateOrderState(objectID, state, function (err, order) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        if (order != undefined) {


            //TODO: send email/receipt
            models.orderModel.getOrderByID(objectID, function (err, updatedOrder) {
                if (err) {
                    return res.status(400).json({error: "Database error" + err});
                }


                if (updatedOrder[0] != undefined) {

                    //update book stock
                    models.bookModel.removeStock(updatedOrder[0].book.ISBN, updatedOrder[0].quantity, function(err, updatedBook) {
                        console.log(updatedBook);
                    });

                    if (res != null) {
                        return res.status(200).json({order: updatedOrder[0]});
                    }
                } else {
                    return res.status(400).json({error: "No updated order"});
                }
            });

        } else {
            res.status(400).json({error: "No order defined"});
        }
    });
};

var createOrder = function (objectID, ISBN, quantity, state, res) {
    //mensagem para a queue com 10*(o que foi pedido)
    //state: waiting expedition
    //quando envia state: dispatch should occur at (depois de amanha)

    models.orderModel.updateOrderState(objectID, state, function (err, order) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        console.log("updated");
        if (order != undefined) {
            console.log("order");
            models.queueModel.pushOrder(objectID, ISBN, quantity*10, function (err, item) {
                console.log("item");
                if (err) {
                    console.log(err);
                    res.status(400).json({error: "Database error" + err});
                }

                if (item != undefined) {
                    console.log("warehouse");
                    console.log(item);
                }
            })
        }
    });
};

exports.addStock = function(objectID, ISBN, quantity, res) {
    models.stockModel.addStock(objectID, ISBN, quantity, function (err, stock) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }

        res.status(200).json({ok: "processed"});
    })
};

exports.getStock = function (res) {
    models.stockModel.getStock(function (err, stock) {
        if (err) {
            res.status(400).json({error: err});
        }

        if (stock != undefined) {
            res.status(200).json(stock);
        } else {
            res.status(400).json({error: "No stock no fun"});
        }
    });
};

exports.updateStock = function(ISBN, quantity, res) {
    models.bookModel.updateStock(ISBN, quantity, function (err, stock) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }
        models.orderModel.getWaitingExpedition(ISBN, function(err, ordersToUpdate){
            if(err){
                res.status(400).json({err: err});
            }
            for(var i in ordersToUpdate){
                console.log(ordersToUpdate[i]);
                if(ordersToUpdate[i].quantity <= quantity){
                    var state = "Dispatch will occur " + (moment().add(2, 'days')).format();
                    processSale(ordersToUpdate[i]._id, state, null);
                } else {
                    break;
                }
            }
            models.stockModel.removeStock(ISBN, quantity, function(err, manuel){
                if(err){
                    res.status(400).json({err: err});
                }
                res.status(200).json({ok: "updated"});
            });
        });
    })
};

exports.getOrderList = function (email, res) {
    models.orderModel.getOrdersByEmail(email, function(err, orders) {
        if (err) {
            res.status(400).json({error: "Database error:" + err});
        }

        if (orders != undefined) {
            res.status(200).json(orders);
        } else {
            res.status(400).json({error: 'Ja nao deu'});
        }
    });
};