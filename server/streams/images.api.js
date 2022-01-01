var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const Track = require('../model/track.model');

router.route('/album/:picture').get((req, res) => {
    let picture = req.params.picture;
    const file = __dirname + '/../data/pictures/' + picture;
    fs.createReadStream(file).on('error', () => {
        res.end("File not found")
    }).pipe(res);
});

router.route('/thumbnail/:picture').get((req, res) => {
    let picture = req.params.picture;
    const file = __dirname + '/../data/thumbnail/' + picture;
    fs.createReadStream(file).on('error', () => {
        res.end("File not found")
    }).pipe(res);
});

module.exports = router;