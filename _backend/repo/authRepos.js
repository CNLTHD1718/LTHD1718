var jwt = require('jsonwebtoken'),
    rndToken = require('rand-token'),
    moment = require('moment'),
    DbFunction = require('../fn/sqlite3-db'),
    config = require('../fn/config')

class AuthRepos {
    generateAccessToken(userEntity) {
        var payload = {
            user: userEntity,
            info: 'more info'
        }

        var token = jwt.sign(payload, config.secret, {
            expiresIn: config.lifetime
        })

        return token;
    }

    verifyAccessToken(req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, config.secret, (err, payload) => {
                if (err) {
                    res.statusCode = 401;
                    res.json({
                        msg: 'Invalid Token',
                        error: err
                    })
                    console.log(err);
                }
                else {
                    req.token_payload = payload;
                    next();
                }
            })
        }
        else {
            res.statusCode = 403;
            res.json({
                msg: 'No Token'
            })
        }
    }

    generateRefreshToken() {
        const size = 80;
        return rndToken.generate(size);
    }

    updateRefreshToken(Id, rfToken) {
        var time = moment().unix();
        return DbFunction.run(`UPDATE User SET rfToken = ?,rfTokenTime = ? WHERE Id = ?`,
            [rfToken, time, Id]);
    }

}

module.exports = new AuthRepos();