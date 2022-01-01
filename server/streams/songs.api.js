var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

const Track = require('../model/track.model');

router.route('/:id').get((req, res) => {
    let id = req.params.id;
    Track.findById(id, (err, docs) => {
        const file = __dirname + '/../data/songs/' + docs.title + '.mp3';
        const stat = fs.statSync(file);
        const total = stat.size;
        if (req.headers.range) {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];

            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            var chunksize = (end - start) + 1;
            var readStream = fs.createReadStream(file, { start: start, end: end });
            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mp3'

            });
            readStream.pipe(res);
        } else {
            res.writeHead(200, { 'Content-Length': total, 'Accept-Ranges': 'bytes', 'Content-Type': 'audio/mp3' });
            fs.createReadStream(file).pipe(res);
        }
    });
});

module.exports = router;