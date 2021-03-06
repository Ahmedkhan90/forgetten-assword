var express = require("express");
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken
var { userModel, otpModel } = require("../dbrepo/models"); // problem was here, notice two dots instead of one
var postmark = require("postmark");
var { SERVER_SECRET } = require("../core/index");
var emailApi = process.env.EMAIL_API;
var api = express.Router();



//******* SIGNUP ********//


api.post("/signup", (req, res, next) => {

    if (!req.body.userName ||
        !req.body.userEmail ||
        !req.body.userPassword ||
        !req.body.userPhone
    ) {

        res.status(403).send(`
            please send name, email, password, phone and gender in json body.
            e.g:
            {
                "name": "farooqi",
                "email": "farooq@gmail.com",
                "password": "12345",
                "phone": "03332765421",
                
            }`)
        return false;
    }





    userModel.findOne({ email: req.body.userEmail },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.userPassword).then(function (hash) {

                    var newUser = new userModel({
                        "name": req.body.userName,
                        "email": req.body.userEmail,
                        "password": hash,
                        "phone": req.body.userPhone,
                    })
                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                message: "user created"
                            })
                        } else {
                            console.log(err);
                            res.status(500).send({
                                message: "user create error, " + err
                            })
                        }
                    });
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.send({
                    message: "User already exist ",
                    status: 409
                })
            }
        })

})




//LOGIN

api.post("/login", (req, res, next) => {

    if (!req.body.email || !req.body.password) {

        res.status(403).send(`
                please send email and password in json body.
                e.g:
                {
                    "email": "malikasinger@gmail.com",
                    "password": "abc",
                }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {

                bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                    if (isMatched) {
                        console.log("matched");

                        var token =
                            jwt.sign({
                                id: user._id,
                                name: user.name,
                                email: user.email,
                            }, SERVER_SECRET)

                        res.cookie('jToken', token, {
                            maxAge: 86_400_000,
                            httpOnly: true
                        });



                        res.send({
                            message: "login success",
                            user: {
                                name: user.name,
                                email: user.email,
                                phone: user.phone,
                                gender: user.gender,
                            }
                        });

                    } else {
                        console.log("not matched");
                        res.status(401).send({
                            message: "incorrect password"
                        })
                    }
                }).catch(e => {
                    console.log("error: ", e)
                })

            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        });

})

//LOGOUT



api.post("/logout", (req, res, next) => {
    res.cookie('jToken', "", {
        maxAge: 86_400_000,
        httpOnly: true
    });
    res.send("logout success");
})

//FORGOT PASSWORD



api.post("/forget-password", (req, res, next) => {

    if (!req.body.email) {

        res.status(403).send(`
            please send email in json body.
            e.g:
            {
                "email": "farooqi@gmail.com"
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {
                const otp = Math.floor(getRandomArbitrary(11111, 99999))

                otpModel.create({
                    email: req.body.email,
                    otpCode: otp
                }).then((doc) => {

                    // client.sendEmail({
                    //     "From": "ahmed_student@sysborg.com",
                    //     "To": req.body.email,
                    //     "Subject": "Reset your password",
                    //     "TextBody": `Here is your pasword reset code: ${otp}`
                    // }).then((status) => {

                    //     console.log("status: ", status);
                    //     res.send({
                    //         message: "Email Send OPT",
                    //         status: 200
                    //     })

                    // })
                    console.log("your OTP: ", otp);
                    res.send({
                                message: "Email Send OPT",
                                status: 200
                            })

                }).catch((err) => {
                    console.log("error in creating otp: ", err);
                    res.status(500).send("unexpected error ")
                })


            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        });
})

api.post("/forget-password-step-2", (req, res, next) => {

    if (!req.body.email && !req.body.otp && !req.body.newPassword) {

        res.status(403).send(`
            please send email & otp in json body.
            e.g:
            {
                "email": "farooqi@gmail.com",
                "newPassword": "******",
                "otp": "#####" 
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, user) {
            if (err) {
                res.status(500).send({
                    message: "an error occured: " + JSON.stringify(err)
                });
            } else if (user) {

                otpModel.find({ email: req.body.email },
                    function (err, otpData) {



                        if (err) {
                            res.status(500).send({
                                message: "an error occured: " + JSON.stringify(err)
                            });
                        } else if (otpData) {
                            otpData = otpData[otpData.length - 1]

                            console.log("otpData: ", otpData);

                            const now = new Date().getTime();
                            const otpIat = new Date(otpData.createdOn).getTime(); // 2021-01-06T13:08:33.657+0000
                            const diff = now - otpIat; // 300000 5 minute

                            console.log("diff: ", diff);

                            if (otpData.otpCode === req.body.otp && diff < 300000) { // correct otp code
                                otpData.remove()

                                bcrypt.stringToHash(req.body.newPassword).then(function (hash) {
                                    user.update({ password: hash }, {}, function (err, data) {
                                        res.send({
                                            massege: "Your Password Has Been Updated"
                                        });
                                    })
                                })

                            } else {
                                res.status(401).send({
                                    message: "incorrect otp"
                                });
                            }
                        } else {
                            res.status(401).send({
                                message: "incorrect otp"
                            });
                        }
                    })

            } else {
                res.status(403).send({
                    message: "user not found"
                });
            }
        });
})



//POST

api.post("/tweet", (req, res, next) => {
   

    if (!req.body.jToken.id || !req.body.tweet) {
        res.send({
            status: 401,
            message: "Please write tweet"
        })
    }
    userModel.findById(req.body.jToken.id, 'name', function (err, user) {
        if (!err) {
            tweetModel.create({
                "username": user.name,
                "tweet": req.body.tweet
            }, function (err, data) {
                if (err) {
                    res.send({
                        message: "Tweet DB ERROR",
                        status: 404
                    });
                }
                else if (data) {
                    console.log("data checking Tweeter ", data);
                    res.send({
                        message: "Your Tweet Send",
                        status: 200,
                        tweet: data
                    });
                    io.emit("NEW_POST", data);

                    console.log("server checking code tweet ", data.tweet)
                } else {
                    res.send({
                        message: "Tweets posting error try again later",
                        status: 500
                    });
                }
            });

        } else {
            res.send({
                message: "User Not Found",
                status: 404
            });
        }
    });


});

api.get("/tweet-get", (req, res, next) => {
    tweetModel.find({}, function (err, data) {
        if (err) {
            res.send({
                message: "Error :" + err,
                status: 404
            });
        } else if (data) {
            res.send({
                tweet: data,
                status: 200
            });
        } else {
            res.send({
                message: "User Not Found"
            });
        }
    });
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
module.exports = api;



