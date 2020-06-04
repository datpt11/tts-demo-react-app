var express = require('express');

var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('23jh2jk1h32k1'));
const port = 8080;

app.get('/items', (req, res) => {
  MongoClient.connect(
    'mongodb://localhost:27017/youtube-db',
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) throw err;

      var db = client.db('youtube-db');

      db.collection('items')
        .find()
        .toArray(function (err, result) {
          if (err) throw err;

          res.send(result);
        });
    }
  );
});
app.post('/register', (req, res) => {
  MongoClient.connect(
    'mongodb://localhost:27017/youtube-db',
    { useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db('youtube-db');
      var myobj = { username: req.body.uname, password: req.body.psw };
      dbo.collection('users').insertOne(myobj, function (err) {
        if (err) {
          res.json(err);
        }
        res.json({
          message: 'success',
        });
        console.log('1 document inserted');
        db.close();
      });
    }
  );
});
app.post('/login', (req, res) => {
  const { uname, psw } = req.body;
  console.log(uname, psw);
  MongoClient.connect(
    'mongodb://localhost:27017/youtube-db',
    { useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db('youtube-db');
      //Find the first document in the customers collection:
      dbo
        .collection('users')
        .findOne({ username: uname }, function (err, result) {
          if (err) throw err;

          if (result.password === psw) {
            // res.header('Access-Control-Allow-Credentials', true);
            // res.header('Access-Control-Allow-Origin', req.headers.origin);
            // res.header(
            //   'Access-Control-Allow-Methods',
            //   'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
            // );
            // res.header(
            //   'Access-Control-Allow-Headers',
            //   'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
            // );
            const payload = {
              id: result._id,
            };

            const token = jwt.sign(payload, 'ddsada');
            // res.cookie('token', token);

            res.json({
              token: token,
              id: result._id,
              message: 'success',
            });
            // } else {
            //   res.json({
            //     message: 'fail',
            //   });
            res.send();
          }
          db.close();
        });
    }
  );
});
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});
