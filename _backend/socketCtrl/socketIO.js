var RequestRepo = require('../repo/requestRepos'),
    userRepo = require('../repo/userRepos'),
    moment = require('moment');
var requestRepo = new RequestRepo();
var eventGetAll = (io, client) => {
    requestRepo.loadAll_Request_Waiting()
        .then(rows => {
            io.sockets.emit('load-new-request', rows);
        })
        .catch(err => {
            // io.sockets.emit('event-request-reciever',{
            //     msg: 'error to get list request waiting',
            //     err: err
            // });
            console.log('err load-new-request' + err);
        })
}

var eventGetAllDriver = (io, client) => {
    userRepo.loadAll()
        .then(rows => {
            io.sockets.emit('load-all-driver', rows);
        })
        .catch(err => {
            // io.sockets.emit('event-request-management', JSON.stringify({
            //     msg: 'error to get list request-reciever',
            //     err: err
            // }));
            console.log('err load-all-driver' + err);
        })
}

//var driverConnect = (io, client) =>{    
//var findRequest= (id) =>{

module.exports.response = function (io, client) {
    client.on('SEND_MESSAGE', function (data) {
        io.emit('MESSAGE', data)
    });

    client.on('add-new-request', function (data) {
        //newReq.iat = moment().unix();
        requestRepo.insert(data)
            .then(() => {
                console.log('add-new-request success');
                eventGetAll(io, client);
            })
            .catch(err => {
                console.log('err eventGetAll' + err);
            })
    });

    client.on('driver-change-status', function (data) {
        console.log(data)
        userRepo.updateStatus(data)
            .then(() => {
                console.log('driver-change-status success');
                eventGetAllDriver(io, client);
            })
            .catch(err => {
                console.log('err eventGetAllDriver' + err);
            })
    });

    // switch (client.u_type) {
    //     case '0':
    //         eventGetAll(io, client);
    //         break;
    //     case '1':
    //         eventGetAllReq(io, client);
    //         break;
    //     case '2': driverConnect(io, client);
    //         break;
    //}
    // eventGetAllReq(io, client);

    // client.on('disconnecting', (reason) => {
    //     console.log('disconnecting, id = ' + client.id + reason);
    // });

    // client.on('even-add-request', (obj) => {
    //     var newReq = JSON.parse(obj);
    //     //newReq.iat = moment().unix();
    //     requestRepo.insert(newReq)
    //         .then(() => {
    //             console.log('even-add-request');
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // });

    // client.on('event-change-stt-to-1', (req) => {
    //     var _req = JSON.parse(req);
    //     requestRepo.updateLocate(_req)
    //         .then(() => {
    //             io.sockets.emit('event-change-stt-to-1-ok', req);
    //             console.log('event-change-stt-to-1-ok');
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // })
}
