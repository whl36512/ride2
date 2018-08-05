const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const util = require('util')


app.use(bodyParser.json());

app.post('/linkedin/callback', callback)

function callback(req, res) {
    console.info('20180803 req=' + util.inspect(req, {showHidden: false, depth: null})) ;

  
/*
  const body = req.body;

  const user = USERS.find(user => user.username == body.username);
  if(!user || body.password != 'todo') return res.sendStatus(401);
  
  var token = jwt.sign({userID: user.id}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
  res.send({token});
*/
});
