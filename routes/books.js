const express = require('express'),
      router  = express.Router(),
      s       = require('../server.js');
module.exports = router;

router.get('/', (req, res) => {
  res.render('books');
});

router.get('*', (req, res) => {
  res.redirect('/books');
});
