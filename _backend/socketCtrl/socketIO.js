var RequestRepo = require('../repo/requestRepos'),
    userRepo = require('../repo/userRepos'),
    moment = require('moment'),
    haversine = require('haversine'),
    config = require('../fn/config');
var requestRepo = new RequestRepo();


var clients = {};
var driversDecline = [];
var count_public = 0;
var req_detail = null;
var req_detailsend = null;
var range =null;
var eventGetAll = (io, client) => {
    requestRepo.loadAll()
        .then(rows => {
            io.sockets.emit('load-all-request', rows);
        })
        .catch(err => {
            // io.sockets.emit('event-request-reciever',{
            //     msg: 'error to get list request waiting',
            //     err: err
            // });
            console.log('err load-new-request' + err);
        })
}

var eventGetUnidentified = (io, client) => {
    requestRepo.loadUnidentified()
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
                    req_detailsend=req;
                    console.log('find nearest driver for request');
                    console.log(req);

                    userRepo.loadAll_Driver_Ready(driversDecline).then(drivers => {
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
                        range=min;
                        resolve(driver);
                        console.log('resolve ' + driver.Id + driver.Name);

                    }).catch(err => reject(err));

                } else {
                    reject(new Error("req not found !"));
                    console.log("req not found !")
                }

            }).catch(err => reject(err));
    });
}

var fn = (io, data_2) => {
    findNeareastDriver(data_2.Id)
        .then(driver => {
            var datax = data_2;
            if (driver) {
                if (clients[driver.Id]) {
                    console.log('data send to driver is ');
                    console.log(datax);
                    var datasend={
                        Id:datax.Id,
                        Lat:datax.Lat,
                        Lng:datax.Lng,
                        Address:datax.Address,
                        Phone:datax.Phone,
                        Note:datax.Note,
                        Name:datax.Name,
                        Long:range
                    }
                    console.log('range : '+range);
                    io.sockets.to(clients[driver.Id].socket).emit('driver-receive-new-request', datasend)
                }
                else {
                    console.log('DRIVER SOCKET LOGIN ERR ')
                }
            }
            else {
                count_public++;
                console.log('COUNT TIME : ' + count_public)
                if (count_public < config.NTimeFind) {
                    setTimeout(function () {
                        fn(io, req_detail);
                    }, 3000);
                }
                else {
                    console.log('FAIL => find user count time :' + (count_public - 1))
                }
            }
        })
        .catch(err => {
            console.log('err socket id here ' + err);
            reject(new Error('err socket id here ' + err));
        })
}


module.exports.response = function (io, client) {

    client.on('add-user', function (data) {
        clients[data.username] = {
            "socket": client.id
        };
        console.log('add new user to socket: ')
        console.log(clients);
        //console.log(moment().format("DD/MM/YYYY hh:mm:ss a"));
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
                //console.log('client id : '+data.uid)
                //console.log(clients[data.uid]);
                if (clients[data.uid]) {
                    io.sockets.to(clients[data.uid].socket).emit('res-add-new-request', { res: 'success' })
                }
                eventGetAll(io, client);
                eventGetUnidentified(io, client);
            })
            .catch(err => {
                console.log('err eventGetAll: ' + err);
            })
    });

    client.on('identify-location', function (data) {
        driversDecline = [];
        console.log(data)
        count_public = 0;
        requestRepo.updateLocate(data)
            .then(() => {
                console.log('identify-location success');
                eventGetAll(io, client);
                eventGetUnidentified(io, client)
                return requestRepo.load(data.Id);
            })
            .then(data_2 => {
                req_detail = data_2;
                fn(io, data_2);
            })
            .catch(err => {
                console.log('err ' + err)
            })
    });

    client.on('get-detail-request', function (data) {
        console.log(data)
        requestRepo.loadDetail(data.id)
            .then(row => {
                // console.log('get row');
                // console.log(row)
                if (clients[data.uid]) {
                    io.sockets.to(clients[data.uid].socket).emit('receive-detail-request', row)
                }
                //eventGetAllDriver(io, client);
            })
            .catch(err => {
                console.log('err eventGetAllDriver' + err);
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
        console.log('driver change location')
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
        count_public = 0;
        console.log(data);
        var req_obj = {
            Id: data.req_id,
            Status: 2
        }//2 : request has been accepted
        if (data.u_id && data.req_id) {
            requestRepo.update(req_obj)
                .then(() => {
                    console.log('updated request status to 2')
                    var driver_obj = {
                        Id: data.u_id,
                        Status: 2
                    }//2 : driver is picking up user
                    console.log(driver_obj);
                    return userRepo.updateStatus(driver_obj);
                }).then(() => {
                    var obj = {
                        ReqID: data.req_id,
                        DriID: data.u_id,
                        RLat:data.rlat,
                        RLng:data.rlng,
                        DLat:data.dlat,
                        DLng:data.dlng,
                    }
                    return requestRepo.insertDetail(obj)
                })
                .then(() => {
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

    client.on('driver-decline-request', function (data) {
        driversDecline.push(data.u_id);
        console.log('list driver decline');
        console.log(driversDecline);
        count_public++;
        if (count_public < config.NTimeFind) {
            console.log('count time is : ' + count_public);
            setTimeout(function () {
                fn(io, req_detail);
            }, 3000);
        }

    });

    client.on('driver-start-request', function (data) {
        console.log(data);
        var req_obj = {
            Id: data.req_id,
            Status: 3
        }//3 : on way moving
        console.log(data.u_id)
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
                    console.log('updated request status to 4')
                    var driver_obj = {
                        Id: data.u_id,
                        Status: 1
                    }//3 : driver is ready for new request
                    console.log(driver_obj);
                    return userRepo.updateStatus(driver_obj);
                })
                .then(() => {
                    var obj = {
                        ReqID: data.req_id,
                        DriID: data.u_id
                    }
                    return requestRepo.updateDetail(obj)
                })
                .then(() => {
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
