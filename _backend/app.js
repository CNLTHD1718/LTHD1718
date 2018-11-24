var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');
var PORT = process.env.PORT || 1234;

var testCtrl = require('./apiCtrl/testCtrl');
var requestCtrl = require('./apiCtrl/requestCtrl');

var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/user/', testCtrl);
app.use('/Request/', requestCtrl);

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs api'
    });
})


app.listen(PORT, ()=>{
    console.log('Server running at localhost:' + PORT);
});