var express = require('express');
var httpStatus = require('http-status-codes');
var router = express.Router();
const User = require('../model/user.model');

router.put('/like/:id', (req, res) => {
    let id = req.params.id;
    let data = req.body;
    User.findByIdAndUpdate(id, { "$push": { "liked": data } }, (err, doc) => {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        else {
            res.status(httpStatus.OK).send(doc);
        }
    });
});

router.put('/unlike/:id', (req, res) => {
    let id = req.params.id;
    let data = req.body;
    User.findByIdAndUpdate(id, { "$pull": { "liked": data } }, (err, doc) => {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        else {
            res.status(httpStatus.OK).send(doc);
        }
    });
});

module.exports = router;