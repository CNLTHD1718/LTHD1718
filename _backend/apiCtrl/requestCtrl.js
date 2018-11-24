var express = require('express');
var router = express.Router();
var RequestRepo = require('../repo/requestRepos');
var requestRepo = new RequestRepo();

router.get('/', (req, res) => {// get list request
    requestRepo.loadAll()
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

router.get('/add', (req, res) => {//add using get
    var obj = {
        Name: req.query.Name,
        Address: req.query.Address,
        Phone: req.query.Phone,
        Note: req.query.Note
    }
    requestRepo.insert(obj).then(() => {
        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'add success',
            obj: obj
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

router.post('/add', (req, res) => {//add using post
    var obj = {
        Name: req.body.Name,
        Address: req.body.Address,
        Phone: req.body.Phone,
        Note: req.body.Note
    }
    console.log(obj);

    requestRepo.insert(obj).then(() => {
        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'located success',
            obj: obj
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

router.post('/identify', (req, res) => {//identify location 
    var obj = {
        Id: req.body.Id,
        Lat: req.body.Lat,
        Lng: req.body.Lng
    }
    console.log(obj);

    requestRepo.updateLocate(obj).then(() => {
        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'add success',
            obj: obj
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

router.post('/del', (req, res) => {
    var id = req.body.id;
    console.log(id)
    requestRepo.delete(id).then(() => {

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
    requestRepo.update(obj).then(() => {

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