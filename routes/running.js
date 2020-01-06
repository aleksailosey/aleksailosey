const express = require('express'),
      router  = express.Router(),
      s       = require('../server.js');
module.exports = router;

router.get('/', (req, res) => {
  res.render('running');
});

router.get('*', (req, res) => {
  res.redirect('/running');
});
