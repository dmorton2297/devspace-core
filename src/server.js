import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes.js';
import prouter from './routes/publicRoutes.js';
import cors from 'cors';
import Logger from './logger.js';
import moment from 'moment';
import admin from "firebase-admin";

//=========== Create application ===========
const app = express();
const port = process.env.PORT || 3200;
const logger = new Logger();

//=========== Initialize firebase ==========
const firebaseServiceAccount = {
    type: process.env.FIREBASE_SERVICE_ACCT_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIEND_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
}

logger.info('Initializing firebase');
admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
    databaseURL: "https://devspace-ec004.firebaseio.com"
});
logger.info('Fire base initialized');

const testPreflight = req => {  
    const controlMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const allowHeaders = 'authorization,content-type';
    const checkOne = (req.headers['access-control-request-method'] && controlMethods.includes(req.headers['access-control-request-method']));
    const checkTwo = (req.headers['access-control-request-headers'] && allowHeaders.includes( req.headers['access-control-request-headers']));
    return (checkOne && checkTwo);
}

//=========== Authentication middleware ===========
app.use((req, res, next) => {
    const m = moment();
    console.log();
    logger.info('======REQUEST======')
    logger.info(`Request occured at: ${m.format()} (${m.format('MM/DD/YYYY hh:mm:ss')})`);
    // Check headers for a preflight request
    if (testPreflight(req)) {
        req.authenticated = true;
        logger.debug('Preflight Request');
        next();
        return;
    }

    if (!req.headers.authorization) {
        // Request NOT Authenticated
        logger.error('Authorization token not set');
        req.authenticated = false;
        next();
        return;
    }

    admin.auth().verifyIdToken(req.headers.authorization)
        .then(function (decodedToken) {
            // Request Authenticated
            logger.debug('ID Token from request verified.');
            logger.debug(`Extracted user emai: ${decodedToken.email}`);
            logger.info('Request Authenticated');
            logger.info(`Path: ${req.path}`)
            req.authenticated = true;
            req.authEmail = decodedToken.email;
            next();
        }).catch(function (error) {
            // Request NOT Authenticated
            logger.error(error);
            req.authenticated = false;
            next();
        });
});

// =========== Setup MISC Middleware ===========
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//=========== Setup Router ===========
app.use('/proute/', prouter );
app.use('/', router);

// =========== Begin Listening for requests
app.listen(port, () => {
    logger.info(`portfolium-backend: running at port ${port}`);
});

