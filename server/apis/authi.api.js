var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var User = require('../model/user.model');
var Role = require('../model/role.model');

router.post('/signup', function(req, res) {
    var body = req.body;

    var obj = new User(body);
    User.find({
        email: obj.email
    }, (error, emailData) => {

        if (emailData && emailData.length) {
            return res.json({
                success: false,
                message: 'User Already Registered'
            });
        }

        Role.findOne({
            name: 'User'
        }).exec(
            function(err, data) {
                if (err) {
                    return res.send(err);
                }
                obj.roles = [];
                obj.loginTime = new Date();
                obj.initials = obj.name.charAt(0);
                const id = mongoose.Types.ObjectId(data._id);
                obj.roles.push(id);
                obj.save(function(err) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Unable to create User'
                        });
                    }
                    return res.json({
                        success: true,
                        message: 'User created Successfully'
                    });

                });

            });
    });
});

router.post('/login', function(req, res) {
    User.findOne({
            email: req.body.email,
            password: req.body.password
        })
        .populate('roles').exec(function(err, loginData) {
            if (err) {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
            }
            if (loginData) {
                let roles = [];
                for (let i = 0; i < loginData.roles.length; i++) {
                    roles.push(loginData.roles[i].name);
                }
                const authObj = {
                    userId: loginData._id,
                    name: loginData.name,
                    loginTime: loginData.loginTime,
                    contact: loginData.contact,
                    initials: loginData.initials,
                    roles: roles,
                    email: req.body.email
                };
                res.json({
                    success: true,
                    user: authObj
                });

                User.findByIdAndUpdate(authObj.userId, { loginTime: new Date() }, (err, doc) => {
                    if (err) {
                        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
                    } else {
                        console.log('Done ');
                    }

                });
            } else {
                res.json({
                    success: false,
                    message: 'Authentication failed. Not Entitled for the access.'
                });
            }
        });
});



module.exports = router;