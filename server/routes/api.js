var express = require('express');
var router = express.Router();

router.use('/', require('../apis/auth.api'));
router.use('/user', require('../apis/user.api'));
router.use('/role', require('../apis/role.api'));
router.use('/track', require('../apis/track.api'));
router.use('/playlist', require('../apis/playlist.api'));

module.exports = router;