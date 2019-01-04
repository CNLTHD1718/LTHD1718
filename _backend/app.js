const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    jwt = require('jsonwebtoken'),
    config = require('./fn/config'),
    PORT = process.env.PORT || 1234;

var requestCtrl = require('./apiCtrl/requestCtrl'),
    userCtrl = require('./apiCtrl/userCtrl'),
    authCtrl = require('./apiCtrl/authCtrl'),
    request_io = require('./socketCtrl/socketIO');

var AuthRepo = require('./repo/authRepos');

var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:1234');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/Request/',AuthRepo.verifyAccessToken, requestCtrl);
app.use('/User/', AuthRepo.verifyAccessToken, userCtrl);
// app.use('/User2/', userCtrl);
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

io.on('connection', client => {
    request_io.response(io, client);
    console.log('id : '+client.id)
});

