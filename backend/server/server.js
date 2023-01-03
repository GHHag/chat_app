require('dotenv').config({ path: `${process.cwd()}/../../.env` });
const express = require('express');
const session = require('express-session');
//const bodyParser = require('body-parser');
const router = require('./api/routes');

const port = process.env.BACKEND_HTTP_PORT;
const api_url = process.env.API_URL;

const server = express();

//server.use(bodyParser.urlencoded());
//server.use(bodyParser.json());
server.use(express.json({ limit: '100MB' }));
server.use(api_url, router);

server.listen(port, () => console.log(`Server live at ${port}`));

let salt = 'someUnusualStringThatIsUniqueForThisProject';

if (!process.env.COOKIE_SALT) {
    console.log('Missing env. variable COOKIE_SALT');
    process.exit();
}
else if (process.env.COOKIE_SALT.length < 32) {
    console.log('Shutting down, env. variable COOKIE_SALT too short.')
    process.exit();
}
else {
    salt = process.env.COOKIE_SALT;
}

server.use(session({
    secret: salt,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    //store: store({ dbPath: './database/bookshop.db' })
    //store: router.store
}));