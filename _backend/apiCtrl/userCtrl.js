var express = require('express');
var router = express.Router();
var UserRepo = require('../repo/userRepos');
var userRepo = new UserRepo();

router.post('/auth', (req,res)=>{
    res.status(200).send({
        msg : 'verify ok !'
    });
})

router.get('/', (req, res) => {// get list user
    userRepo.loadAll()
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
        Username: req.query.Username,
        Password: req.query.Password,
        Email: req.query.Email,
        Address: req.query.Address
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

router.post('/add', (req, res) => {//add user
    var obj = {
        Name: req.body.Name,
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Address: req.body.Address
    }
    console.log(obj);

    userRepo.insert(obj).then(() => {
        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'add user success',
            obj: obj
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

router.post('/updateStatus', (req, res) => {
    var obj = {
        Id: req.body.Id,
        Status: req.body.Status
    }
    console.log(obj)
    userRepo.updateStatus(obj).then(() => {

        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'update status success'
        }));

    }).catch(err => {
        res.status(404).send(JSON.stringify({
            sst: 'error',
            err: err
        }));
    });

});

router.post('/updateLocation', (req, res) => {
    var obj = {
        Id: req.body.Id,
        Lat: req.body.Lat,
        Lng:req.body.Lng
    }
    console.log(obj)
    userRepo.updateLocation(obj).then(() => {

        res.status(201).send(JSON.stringify({
            stt: 'success',
            msg: 'update location success'
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
    userRepo.delete(id).then(() => {

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

module.exports = router;