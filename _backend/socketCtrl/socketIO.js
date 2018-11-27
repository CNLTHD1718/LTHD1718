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

var findNeareastDriver = (req_id) => {
    return new Promise((resolve, reject) => {
        requestRepo.load(req_id)
            .then(req => {
                if (req) {
                    console.log('find nearest driver for request');
                    console.log(req);
                    userRepo.loadAll_Driver_Ready().then(drivers => {
                        var min = null;
                        var driver = null;
                        if (drivers.length < 0) {
                            resolve(null);
                            console.log('No driver found')
                        }
                        req_location = {
                            latitude: req.Lat,
                            longitude: req.Lng
                        }
                        drivers.forEach(dr => {
                            driver_location = {
                                latitude: dr.Lat,
                                longitude: dr.Lng
                            }
                            var long = haversine(driver_location, req_location);
                            if (!min || min > long) {
                                min = long;
                                driver = dr;
                            }
                            console.log('long : ' + long)
                        });
                        resolve(driver);
                        console.log()
                        console.log('resolve ' + driver.Id + driver.Name);

                    }).catch(err => reject(err));
                } else {
                    reject(new Error("req not found !"));
                    console.log("req not found !")
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

    client.on('identify-location', function (data) {
        console.log(data)
        var datax;
        requestRepo.updateLocate(data)
            .then(() => {
                console.log('identify-location success');
                eventGetAll(io, client);
                return requestRepo.load(data.Id);
            })
            .then(data_2 => {
                datax = data_2;
                return findNeareastDriver(data_2.Id);
            })
            .then(driver => {
                if (driver) {
                    if (clients[driver.Id]) {
                        console.log('data send to driver is ');
                        console.log(datax);
                        io.sockets.to(clients[driver.Id].socket).emit('driver-receive-new-request', datax)
                    }
                    else {
                        console.log('socket cannot find driver online ')
                    }
                }
                else {
                    console.log('socket cannot find driver online ')
                }
            })
            .catch(err => {
                console.log('err socket id here ' + err);
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

    //#region system active this event
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
    //#endregion

    //#region app4 active this event
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

    client.on('driver-accept-request', function (data) {
        console.log(data);
        var req_obj = {
            Id: data.req_id,
            Status: 2
        }//2 : request has been accepted
        if (data.u_id && data.req_id) {
            requestRepo.update(req_obj)
                .then(() => {
                    //console.log('driver-accept-request success');
                    //eventGetAll(io, client);
                    console.log('updated request status to 2')
                    var driver_obj = {
                        Id: data.u_id,
                        Status: 2
                    }//2 : driver is picking up user
                    console.log(driver_obj);
                    return userRepo.updateStatus(driver_obj);
                }).then(() => {
                    console.log('updated driver status to 2')
                    eventGetAll(io, client);
                    eventGetAllDriver(io, client);
                    console.log('driver-accept-request success');
                })
                .catch(err => {
                    console.log('err driver-accept-request' + err);
                })

        } else {
            console.log('invalid driver-accept-request')
            console.log(data)
        }
    });

    client.on('driver-start-request', function (data) {
        console.log(data);
        var req_obj = {
            Id: data.req_id,
            Status: 3
        }//3 : on way moving
        if (data.u_id && data.req_id) {
            requestRepo.update(req_obj)
                .then(() => {
                    //console.log('driver-accept-request success');
                    //eventGetAll(io, client);
                    console.log('updated request status to 3')
                    var driver_obj = {
                        Id: data.u_id,
                        Status: 3
                    }//3 : on way driving
                    console.log(driver_obj);
                    return userRepo.updateStatus(driver_obj);
                }).then(() => {
                    console.log('updated driver status to 3')
                    eventGetAll(io, client);
                    eventGetAllDriver(io, client);
                    console.log('driver-start-request success');
                })
                .catch(err => {
                    console.log('err driver-start-request' + err);
                })

        } else {
            console.log('invalid driver-start-request')
            console.log(data)
        }
    });

    client.on('driver-done-request', function (data) {
        console.log(data);
        var req_obj = {
            Id: data.req_id,
            Status: 4
        }//4 : done request
        if (data.u_id && data.req_id) {
            requestRepo.update(req_obj)
                .then(() => {
                    //console.log('driver-accept-request success');
                    //eventGetAll(io, client);
                    console.log('updated request status to 4')
                    var driver_obj = {
                        Id: data.u_id,
                        Status: 1
                    }//3 : driver is ready for new request
                    console.log(driver_obj);
                    return userRepo.updateStatus(driver_obj);
                }).then(() => {
                    console.log('updated driver status to 1')
                    eventGetAll(io, client);
                    eventGetAllDriver(io, client);
                    console.log('driver-done-request success');
                })
                .catch(err => {
                    console.log('err driver-done-request' + err);
                })
        } else {
            console.log('invalid driver-done-request')
            console.log(data)
        }
    });
    //#endregion


}
