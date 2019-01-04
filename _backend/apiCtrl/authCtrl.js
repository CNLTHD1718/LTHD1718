var express = require('express'),
    router = express.Router(),
    UserRepo = require('../repo/userRepos'),
    AuthRepo = require('../repo/authRepos');

router.post('/new_token', (req, res) => {
    var user_rf_token = req.body.ref_token;
    var user_id = req.body.id;
    console.log('new token', req.body);
    if (user_rf_token && user_id) {
        UserRepo.getByToken(user_id, user_rf_token)
            .then(user => {
                console.log('find user ',user);
                var acToken = AuthRepo.generateAccessToken(user);
                var user_res = {
                    auth: true,
                    access_token: acToken
                    // type: user.type
                }
                // if(user.type == 2) {
                //     user_res.status = user.status;
                // }
                res.json(user_res);
            }).catch(err => {
                console.log('error get user by token');
                res.statusCode = 500;
                res.end('View error log on console');
                console.log(err);
            })
    } else {
        res.status(404).send({
            msg: 'not found'
        })
    }
});

router.post('/login', (req, res) => {
    var obj = {
        Username: req.body.Username,
        Password: req.body.Password
    }
    console.log(obj);
    //var type = req.body.Type;
    UserRepo.login(obj).then(user => {
        console.log('check login')
        //console.log(user);
        if (user) {
            var acToken = AuthRepo.generateAccessToken(user);
            var rfToken = AuthRepo.generateRefreshToken();
            console.log('logged')
           // console.log(user)
            AuthRepo.updateRefreshToken(user.Id, rfToken)
                .then(() => {
                    var udetail = {};
                    if (user.Type == 4) {
                        udetail = {
                            Id: user.Id,
                            Username: user.Username,
                            Type: user.Type,
                            Lat: user.Lat,
                            Lng: user.Lng,
                        }
                    } else {
                        udetail = {
                            Id: user.Id,
                            Username: user.Username,
                            Type: user.Type
                        }

                    }
                    var user_res = {
                        auth: true,
                        user: udetail,
                        access_token: acToken,
                        refresh_token: rfToken
                    };
                    // if (user.Type == 4) {
                    //     user_res.user.status = user.status;
                    // }
                    res.json(user_res);
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.end('View error log on console');
                    console.log('err here' + err)
                })
        } else {
            res.status(404).send({
                msg: 'Not Found Username or Password'
            })
            console.log('not found user')
        }
    }).catch(err => {
        res.end('err login |' + err);
        console.log('err login |' + err);
    })
})

module.exports = router;