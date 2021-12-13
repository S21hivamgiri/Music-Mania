var express = require('express');
var httpStatus = require('http-status-codes');
var router = express.Router();
const sharp = require('sharp');
var fs = require('fs');

router.route("/register-all").get((req, res) => {
    const finalFolder = __dirname + '/../data/thumbnail/';
    const initialFolder = __dirname + '/../data/pictures/';
    fs.readdir(initialFolder, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            fs.readFile(initialFolder + filename, 'utf-8', function (err, content) {
                if (err) {
                    onError(err);
                    return;
                }
                sharp(initialFolder + filename)
                    .resize(50)
                    .toFormat("png")
                    .toFile(finalFolder+filename.split('.')[0]+'.png')
                .catch(err => { console.log(err)});
                
            });
        });
        res.send('Succcessful');
    });

});


module.exports = router;