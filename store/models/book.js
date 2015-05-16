/**
 * Created by Vinnie on 14/05/2015.
 */
mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
    title: String,
    author: String,
    publisher: String,
    ISBN: String,
    language: String,
    nPages: Number,
    price: Number,
    stock: Number
});

var Book = mongoose.model('Book', bookSchema);
var resetBooks = false;

if (resetBooks) {
    Book.find().remove((function (err) {
        if(err) {
            console.log("Error deleting books");
        }
        var book1 = new Book({
            title: "The Girl on the Train",
            author: "Paula Hawkins",
            publisher: "Doubleday",
            ISBN: "0857522310",
            language: "English",
            nPages: 320,
            price: 6.00,
            stock: 13
        });
        book1.save();
        var book2 = new Book({
            title: "The Art Therapy Colouring Book",
            author: "Richard Merritt",
            publisher: "Michael O'Mara Books Ltd",
            ISBN: 1782434437,
            language: "Koala",
            nPages: 128,
            price: 3.99,
            stock: 6
        });
        book2.save();
        var book3 = new Book({
            title: "The Art of Eating Well ",
            author: "Jasmine Hemsley",
            publisher: "Ebury Press",
            ISBN: "0091958326",
            language: "English",
            nPages: 320,
            price: 11.75,
            stock: 5
        });
        book3.save();
        var book4 = new Book({
            title: "The Shepherd's Life: A Tale of the Lake District",
            author: "James Rebanks",
            publisher: "Allen Lane",
            ISBN: "1846148545",
            language: "English",
            nPages: 320,
            price: 6.99,
            stock: 2
        });
        book4.save();
        var book5 = new Book({
            title: "The Wine Diet",
            author: "Professor Roger Corder PhD",
            publisher: "Sphere",
            ISBN: "0751542016",
            language: "English",
            nPages: 336,
            price: 10.99,
            stock: 32
        });
        book5.save();
        var book6 = new Book({
            title: "The Hobbit",
            author: "J. R. R. Tolkien",
            publisher: "HarperCollinsChildren'sBooks",
            ISBN: "0007458428",
            language: "English",
            nPages: 368,
            price: 3.50,
            stock: 15
        });
        book6.save();
        var book7 = new Book({
            title: "Elizabeth is Missing",
            author: "Emma Healey",
            publisher: "Penguin",
            ISBN: "0241968186",
            language: "English",
            nPages: 288,
            price: 3.85,
            stock: 1
        });
        book7.save(function () {
            Book.find(function (err, books) {
                if (err) return console.error(err);
                console.log(books)
            });
        });
    }));
}

Book.getBooks = function(callback) {
    Book.find(callback);
};

Book.getBookByISBN = function(ISBN, callback) {
    Book.find({ISBN: ISBN}, callback);
}

exports.bookModel = Book;