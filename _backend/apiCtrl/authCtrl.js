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
    console.log(obj);
    //var type = req.body.Type;
    UserRepo.login(obj).then(user => {
        if (user) {
            console.log('yes user 1')
            var acToken = AuthRepo.generateAccessToken(user);
            console.log('yes user 2:' + acToken)
            var rfToken = AuthRepo.generateRefreshToken();
            console.log('yes user 3:' + rfToken)

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
                        refresh_token: rfToken
                    };
                    console.log('yes user 4:' + user_res)
                    // if (user.Type == 2) {
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
                msg: 'not found'
            })
        }
    }).catch(err => {
        res.end(err);
        console.log(err);
    })
})

module.exports = router;