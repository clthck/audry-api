'use strict';

require('dotenv').config();

const Koa = require('koa');
const Pug = require('koa-pug');
const parseBody = require('koa-body');
const initRoutes = require('./config/initializers/routes.js');

// Initializes koa.js api app.
const app = new Koa();

// Configures pug template engine for JSON response
const pug = new Pug({
  viewPath: './api/views',
  app: app
});

app.use(parseBody());

initRoutes(app);

app.listen(4000);
