var express = require('express');
var httpStatus = require('http-status-codes');
var router = express.Router();
var path = require('path');
var jsmediatags = require("jsmediatags");
var fs = require('fs');
const sharp = require('sharp');
var mongoose = require('mongoose')

const Track = require('../model/track.model');

router.route('/').get((req, res) => {
    Track.find({}).then(docs => {
        res.send(docs);
    }).catch(err => {
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});

router.route('/add').post((req, res) => {
    let obj = req.body;
    let title = obj.title
    var id = new mongoose.Types.ObjectId();
    jsmediatags.read(__dirname + '/../data/songs/' + title +".mp3", {
        onSuccess: function (tag) {
            let album = tag.tags.album;
            let artist = tag.tags.artist.split(',');
            let image = tag.tags.picture.data;
            let format = tag.tags.picture.format;
            let fileName = id + '.' + format.split('/')[1]
            obj.album = album;
            obj.artist = artist;
            obj.picture = fileName;
            obj._id=id;

            let base64String = "";
            for (var i = 0; i < image.length; i++) {
                base64String += String.fromCharCode(image[i]);
            }
            const initialFolder = __dirname + '/../data/pictures/';
            let base64 = Buffer.from(base64String,'binary').toString('base64');
            fs.writeFileSync(initialFolder + fileName, base64,'base64' , function (err) {
                console.log(err); // writes out file without error, but it's not a valid image
            });

            const finalFolder = __dirname + '/../data/thumbnail/';
            fs.readFile(initialFolder + fileName, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                sharp(initialFolder + fileName)
                    .resize(50)
                    .toFormat("png")
                    .toFile(finalFolder + fileName.split('.')[0] + '.png')
                    .catch(err => { console.log(err) });
            });

            Track.create(obj).then(docs => {
                res.status(httpStatus.StatusCodes.CREATED).send(obj);
            }).catch(err => {
                res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            });
        },
        onError: function (error) {
            console.log(':(', error.type, error.info);
        }
    });
});

router.route('/:id').get((req, res) => {
    let id = req.params.id;
    Track.findById(id).then(docs => {
        res.status(httpStatus.StatusCodes.OK).send(docs);
    }).catch(err => {
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});

router.route('/stream/:id').get((req, res) => {
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
})


router.route('/image/:picture').get((req, res) => {
    let picture = req.params.picture;
    const file = __dirname + '/../data/pictures/' + picture;
    fs.createReadStream(file).on('error',()=>{
        res.end("File not found")
    }).pipe(res);
    });

router.route('/thumbnail/:picture').get((req, res) => {
    let picture = req.params.picture;
    const file = __dirname + '/../data/thumbnail/' + picture;
    fs.createReadStream(file).on('error',()=>{
        res.end("File not found")
    }).pipe(res);
});


router.route('/search/:id').get((req, res) => {
    let id = req.params.id;
    Track.find({ $or: [{ tile: { $regex: id } }, { album: { $regex: id } }, { artist: { $regex: id } }] }).then(docs => {
        res.status(httpStatus.StatusCodes.OK).send(docs);
    }).catch(err => {
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});

module.exports = router;