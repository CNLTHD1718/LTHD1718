var RequestRepo = require('../repo/requestRepos'),
    userRepo = require('../repo/userRepos'),
    moment = require('moment'),
    haversine = require('haversine'),
    config = require('../fn/config');
var requestRepo = new RequestRepo();


var clients = {};


var eventGetAll = (io, client) => {
    requestRepo.loadAll()
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

var findRequestNearDriver = (id) => {
    return new Promise((resolve, reject) => {
        userRepo.load(id)
            .then(driver => {
                if (driver) {
                    //console.log('find driver' + driver);
                    requestRepo.loadAll_Request_Ready().then(rows => {
                        var min = null;
                        var user = null;
                        if (rows.length < 0) {
                            resolve(null);
                            console.log('No request found')
                        }

                        rows.forEach(element => {
                            req_location = {
                                latitude: element.Lat,
                                longitude: element.Lng
                            }
                            driver_location = {
                                latitude: driver.Lat,
                                longitude: driver.Lng
                            }
                            var long = haversine(driver_location, req_location);

                            if (!min || min > long) {
                                min = long;
                                user = element;
                            }
                            console.log('long : ' + long)
                        });
                        resolve(user);
                        console.log('resolve ' + user.Id + user.Name);

                    }).catch(err => reject(err));
                } else {
                    reject(new Error("driver not found !"));
                    console.log("driver not found !")
                }

            }).catch(err => reject(err));
    });
}

module.exports.response = function (io, client) {

    client.on('add-user', function (data) {
        clients[data.username] = {
            "socket": client.id
        };
        console.log(clients);
        io.sockets.connected[clients[data.username].socket].emit("hi there 2", data);
        //client.emit('hi there 2',data);
    });

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

    client.on('driver-change-location', function (data) {
        console.log(data)
        userRepo.updateLocation(data)
            .then(() => {
                console.log('driver-change-location success');
                eventGetAllDriver(io, client);
            })
            .catch(err => {
                console.log('err eventGetAllDriver' + err);
            })
    });

    client.on('identify-location', function (data) {
        console.log(data)
        requestRepo.updateLocate(data)
            .then(() => {
                console.log('identify-location success');
                eventGetAll(io, client);
            })
            .catch(err => {
                console.log('err eventGetAll' + err);
            })
    });

    client.on('handling-request', function (data) {
        console.log('handling-request here');
        var count = 1;
        var fn = () => {
            console.log('find driver count time :' + count)
            findRequestNearDriver(data.u_id).then(req => {
                if (req) {
                    console.log('find-driver-successfuly ' + req.Id + req.Name)
                    console.log(req);
                    if (clients[data.u_id])
                        io.sockets.to(clients[data.u_id].socket).emit('driver-receive-new-request', req)
                    //io.sockets.connected[clients[username].socket].emit("driver-receive-new-request", data);
                    else {
                        console.log('no driver connect')
                    }
                }
                else {
                    count++;
                    if (count <= config.NTimeFind) {
                        setTimeout(fn, 3000);
                    }
                    else {
                        console.log('FAIL => find user count time :' + (count - 1))
                    }
                }
            })
                .catch(err => {
                    console.log('err socket ' + err)
                });
        }
        fn();
    });

    client.on('driver-accept-request', function (data) {
        console.log(data);
        var req_obj = {
            Id: data.req_id,
            Status: 2
        }//2 : da co xe nhan
        requestRepo.update(req_obj)
            .then(() => {
                console.log('driver-accept-request success');
                eventGetAll(io, client);
            })
            .catch(err => {
                console.log('err driver-accept-request' + err);
            })
    });



}
