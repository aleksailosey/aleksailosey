const express = require('express'),
      router  = express.Router(),
      s       = require('../server.js');
module.exports = router;

router.get('/', (req, res) => {
  s.getBookObject(function (obj) {
    res.render('books', {
      books: obj.books,
      completed: obj.completed
    });
  });
});

router.post('/push', (req, res) => {
  if (req.body.title && req.body.link) {
    var book = {
      title: req.body.title.trim(),
      link: req.body.link.trim()
    }
    s.pushBook(book, function (success) {
      res.send(success);
    });
  } else {
    res.send(false);
  }
});

router.get('*', (req, res) => {
  res.redirect('/books');
});
