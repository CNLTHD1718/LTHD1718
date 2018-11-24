var express = require('express');
var router = express.Router();
var TestRepo = require('../repo/test');
var testRepo = new TestRepo();

//add using get
router.get('/add', (req, res) => {
    var obj = {
        username: req.query.name,
        password: req.query.password,
        email: 'req.query.email',
        address: 'req.query.address'
    }
    testRepo.add(obj).then(() => {

        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'add success'
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

//add using post
router.post('/add', (req, res) => {
    var obj = {
        username: req.body.username,
        password: 'req.body.password',
        email: 'req.query.email',
        address: 'req.query.address'
    }
    testRepo.add(obj).then(() => {

        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'add success'
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});
router.get('/all', (req, res) => {
    testRepo.getAll()
        .then(rows => {
            res.json(rows);
            console.log(rows);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
})


router.post('/del', (req, res) => {
    var id = req.body.id;
    console.log(id)
    testRepo.remove(id).then(() => {

        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'remove success'
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

router.post('/update', (req, res) => {
    var obj = {
        id: req.body.id,
        username: req.body.username
    }
    console.log(obj)
    testRepo.update(obj).then(() => {

        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'update success'
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

module.exports = router;