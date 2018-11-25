const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    jwt = require('jsonwebtoken'),
    config = require('./fn/config'),
    PORT = process.env.PORT || 1234;


//var io = require('socket.io', { origins: "*" }).listen(PORT + 1);

var requestCtrl = require('./apiCtrl/requestCtrl'),
    userCtrl = require('./apiCtrl/userCtrl'),
    authCtrl = require('./apiCtrl/authCtrl'),
    request_io = require('./socketCtrl/socketIO');

var AuthRepo = require('./repo/authRepos');

var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// var event_req = io.use(function (socket, next) {
//     if (socket.handshake.query && socket.handshake.query.token) {
//         jwt.verify(socket.handshake.query.token, config.secret, function (err, decoded) {
//             if (err) return next(new Error('Authentication error'));
//             socket.decoded = decoded;
//             socket.u_type = socket.handshake.query.u_type;
//             socket.u_id = socket.handshake.query.u_id;
//             next();
//         })
//     } else {
//         next(new Error('Authentication error'));
//     }
// })
//     .on('connection', client => {
//         request_io.response(io, client);
//     })


app.use('/Request/', requestCtrl);
app.use('/User/', AuthRepo.verifyAccessToken, userCtrl);
app.use('/Auth', authCtrl);

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs api'
    });
})


const server = app.listen(PORT, () => {
    console.log('Server running at localhost:' + PORT);
});

const io = require('socket.io')(server);

// io.on('connection', function(socket) {
//     console.log(socket.id)
//     socket.on('SEND_MESSAGE', function(data) {
//         io.emit('MESSAGE', data)
//     });
// });
io.on('connection', client => {
    //console.log(client)
    request_io.response(io, client);
});

