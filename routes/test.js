const express = require('express'),
      router  = express.Router();
module.exports = router;

router.get('/:key', (req, res) => {
  res.render('test', {
    key: req.params.key
  });
});
