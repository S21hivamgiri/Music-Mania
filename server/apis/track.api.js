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

router.route('/add-color/:id').put((req, res) => {
    let id = req.params.id;
    let obj = req.body;
    Track.findByIdAndUpdate(id, { backgroundColor: obj.backgroundColor, textColor: obj.textColor }, (err, doc) => {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        else {
            doc.backgroundColor = obj.backgroundColor;
            doc.textColor = obj.textColor;
            res.status(httpStatus.OK).send(doc);
        }
    });
});

router.route('/add').post((req, res) => {
    let obj = req.body;
    let filename = obj.filename
    var id = new mongoose.Types.ObjectId();
    jsmediatags.read(__dirname + '/../data/songs/' + filename + ".mp3", {
        onSuccess: function (tag) {
            let album = tag.tags.album;
            let artist = tag.tags.artist.split(',');
            let image = tag.tags.picture.data;
            let format = tag.tags.picture.format;
            let title = tag.tags.title;
            let fileName = id + '.' + format.split('/')[1];

            obj.title = title
            obj.album = album;
            obj.artist = artist;
            obj.picture = fileName;
            obj._id = id;

            let base64String = "";
            for (var i = 0; i < image.length; i++) {
                base64String += String.fromCharCode(image[i]);
            }
            const initialFolder = __dirname + '/../data/pictures/';
            let base64 = Buffer.from(base64String, 'binary').toString('base64');
            fs.writeFileSync(initialFolder + fileName, base64, 'base64', function (err) {
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


router.route('/search/:id').get((req, res) => {
    let id = req.params.id;
    Track.find({ $or: [{ tile: { $regex: id } }, { album: { $regex: id } }, { artist: { $regex: id } }] }).then(docs => {
        res.status(httpStatus.StatusCodes.OK).send(docs);
    }).catch(err => {
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });
});

module.exports = router;