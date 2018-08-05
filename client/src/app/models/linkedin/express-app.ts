import {Request, Response} from "express";
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as express from 'express';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const util = require('util')
//import * as jwt from 'jsonwebtoken';
//import * as fs from "fs";

const app: Application = express();

app.use(bodyParser.json());
app.use(querystring.parse());

app.route('/linkedin/callback')
    .get(loginRoute);

//const RSA_PRIVATE_KEY = fs.readFileSync('./demos/private.key');

export function loginRoute(req: Request, res: Response) {
    console.info('20180803 req=' + util.inspect(req, {showHidden: false, depth: null})) ;

    //const email = req.body.email,
          //password = req.body.password;

          /*
    if (validateEmailAndPassword()) {
       const userId = findUserIdForEmail(email);

        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 120,
                subject: userId
            }

          // send the JWT back to the user
          // TODO - multiple options available                              
    }
    else {
        // send status 401 Unauthorized
        res.sendStatus(401); 
    }
    */
}

/*
res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});

res.status(200).json({
  idToken: jwtBearerToken, 
  expiresIn: ...
});
*/
