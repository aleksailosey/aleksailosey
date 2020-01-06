const express = require('express'),
      router  = express.Router(),
      s       = require('../server.js');
module.exports = router;

router.get('/', (req, res) => {
  res.render('contact');
});

router.get('*', (req, res) => {
  res.redirect('/contact');
});
