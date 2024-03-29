var moment = require('moment');
var models = require('../models/index.js');

exports.getUnprocessedOrders = function (res) {
    models.queueModel.getOrders(function (err, orders) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }
        return res.status(200).json(orders);
    });
};

exports.getProcessedOrders = function (res) {
    models.processedOrderModel.getOrders(function (err, orders) {
        if (err) {
            return res.status(400).json({error: "Database error" + err});
        }
        return res.status(200).json(orders);
    });
};

exports.placeOrder = function (name, address, mail, title, ISBN, price, quantity, res) {
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
                    models.bookModel.removeStock(updatedOrder[0].book.ISBN, updatedOrder[0].quantity, function (err, updatedBook) {
                        console.log(updatedBook);
                    });

                    return res.status(200).json({order: updatedOrder[0]});
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
            models.queueModel.pushOrder(objectID, ISBN, quantity * 10, function (err, item) {
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