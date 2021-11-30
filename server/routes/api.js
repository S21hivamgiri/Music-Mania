var express = require('express');
var router = express.Router();

router.use('/', require('../apis/authi.api'));
router.use('/thumbnail', require('../apis/thumbnail.api'));
router.use('/user', require('../apis/user.api'));
router.use('/role', require('../apis/role.api'));
router.use('/track', require('../apis/track.api'));


module.exports = router;