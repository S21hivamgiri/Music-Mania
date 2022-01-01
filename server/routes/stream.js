var express = require('express');
var router = express.Router();

router.use('/songs', require('../streams/songs.api'));
router.use('/images', require('../streams/images.api'));

module.exports = router;