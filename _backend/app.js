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

app.use('/Request/', requestCtrl);
app.use('/User/', AuthRepo.verifyAccessToken, userCtrl);
app.use('/User2/', userCtrl);
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

var clients = [];
io.on('connection', client => {
    request_io.response(io, client);
    console.log('id : '+client.id)
    //clients.push(client.id);
    //client.emit('hi there', JSON.stringify('user'));    
});

