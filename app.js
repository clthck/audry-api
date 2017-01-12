'use strict';

require('dotenv').config();

const Koa = require('koa');
const Pug = require('koa-pug');
const parseBody = require('koa-body');
const apn = require('apn');
const initRoutes = require('./config/initializers/routes.js');

// Initializes koa.js api app.
const app = new Koa();

// Configures pug template engine for JSON response
const pug = new Pug({
  viewPath: './api/views',
  app: app
});

app.context.nurseApnProvider = new apn.Provider({
  cert: './config/apn/nurse/cert.pem',
  key: './config/apn/nurse/key.pem'
});
app.context.patientApnProvider = new apn.Provider({
  cert: './config/apn/patient/cert.pem',
  key: './config/apn/patient/key.pem'
});
app.context.nurseAppBundleId = 'com.tecodo.audryns';
app.context.patientAppBundleId = 'com.tecodo.audry';

app.use(parseBody());

initRoutes(app);

app.listen(4000);
