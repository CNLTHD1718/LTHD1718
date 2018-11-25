var express = require('express'),
    router = express.Router(),
    UserRepo = require('../repo/userRepos'),
    AuthRepo = require('../repo/authRepos');

router.post('/new_token', (req, res) => {
    var user_rf_token = req.body.ref_token;
    var user_id = req.body.id;
    if (user_ref_token && user_id) {
        UserRepo.getByToken(user_id, user_ref_token)
            .then(user => {
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
    //var type = req.body.Type;
    UserRepo.login().then(user => {
        if (user) {
            var acToken = AuthRepo.generateAccessToken(user);
            var rfToken = AuthRepo.generateRefreshToken();

            AuthRepo.updateRefreshToken(user.Id, rfToken)
                .then(() => {
                    var user_res = {
                        auth: true,
                        user: {
                            uid: user.Id,
                            Username: user.Username,
                            //type=user.type
                        },
                        access_token: acToken,
                        refresh_token: rfTokenF
                    };
                    // if (user.Type == 2) {
                    //     user_res.user.status = user.status;
                    // }
                    res.json(user_res);
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.end('View error log on console');
                })
        } else {
            res.status(404).send({
                msg: 'not found'
            })
        }
    }).catch(err => {
        res.end(errF);
        console.log(err);
    })
})

module.exports = router;