const mongodb          = require('mongodb'),
      MongoClient      = mongodb.MongoClient,
      url              = 'mongodb://localhost:27017/u';


module.exports = {
  getBookObject: getBookObject,
  pushBook: pushBook,
}

function connect(callback) {
  /*
    Gives open access to MongoClient instance, closing it once all
    operations are performed.

    @param callback: function, has access to dbo (the MongoClient instance)
                     to perform operations like dbo.collection('...').updateOne(...);
  */
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(error, db) {
    if (error) throw error;
    let dbo = db.db('aleksailosey_db');
    callback(dbo);
    db.close();
  });
}

function init (callback) {
  connect(function (dbo) {
    dbo.collection('books').findOne({ _id: 'book_object' }, function (error, result) {
      if (error) throw error;
      if (result) {
        callback();
      } else {
        connect(function (dbo) {
          dbo.collection('books').insertOne({ _id: 'book_object', books: [], completed: [] }, function (error, result) {
            if (error) throw error;
            callback();
          });
        });
      }
    });
  });
}

function getBookObject(callback) {
  connect(function (dbo) {
    dbo.collection('books').findOne({ _id: 'book_object' }, function (error, bookObj) {
      if (error) throw error;
      callback(bookObj);
    });
  });
}

function getBooks(callback) {
  getBookObject(function (obj){
    callback(obj.books);
  });
}

function getCompleted(callback) {
  getBookObject(function (obj){
    callback(obj.completed);
  });
}

function pushBook(book, callback) {
  getBookObject(function (obj) {
    var unique = true;
    var all = obj.books.concat(obj.completed);
    for (var i = 0; i < all.length; ++i) {
      if (all[i].title === book.title || all[i].link === book.link) {
        unique = false;
        break;
      }
    }
    if (unique) {
      connect(function (dbo) {
        dbo.collection('books').updateOne({ _id: 'book_object' }, { $push: { books: book } }, function (error, result) {
          if (error) throw error;
          callback(true);
        });
      });
    } else {
      callback(false);
    }
  });
}

function pullBook(bookTitle, callback) {
  connect(function (dbo) {
    dbo.collection('books').updateOne({ _id: 'book_object' }, { $pull: { books: { title: bookTitle } } }, function (error, result) {
      if (error) throw error;
      callback();
    });
  });
}


function deleteBooks(callback) {
  connect(function (dbo) {
    dbo.collection('books').deleteMany({}, function (error, result) {
      if (error) throw error;
      callback();
    });
  });
}

function transfer(bookTitle, callback) {
  getBookObject(function (obj) {
    var book = null;
    for (var i = 0; obj.books.length; ++i) {
      if (obj.books[i].title === bookTitle) {
        book = obj.books[i];
        break;
      }
    }
    if (book) {
      pullBook(book.title, function () {
        connect(function (dbo) {
          dbo.collection('books').updateOne({ _id: 'book_object' }, { $push: { completed: book } }, function (error, result) {
            if (error) throw error;
            callback(true);
          })
        });
      });
    } else {
      callback(false);
    }
  });

}

init(function () {

pullBook('rawr xD ;):);0 kees me', function () {
  
})

});
