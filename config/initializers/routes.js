'use strict';

const Router = require('koa-router');
const jwt = require('koa-jwt');
const _ = require('underscore');
const configNurseRoutes = require('../routes/nurse_routes.js');
const configPatientRoutes = require('../routes/patient_routes.js');

const apiPrefix = '/api/v1';
const nurseApiPrefix = `${apiPrefix}/nurse`;
const patientApiPrefix = `${apiPrefix}/patient`;
const routers = {
  nurse: {
    unauthenticated: new Router({ prefix: nurseApiPrefix }),
    authenticated: new Router({ prefix: nurseApiPrefix })
  },
  patient: {
    unauthenticated: new Router({ prefix: patientApiPrefix }),
    authenticated: new Router({ prefix: patientApiPrefix })
  }
}

module.exports = (app) => {
  // Handles error that occurs while processing api requests.
  for (let i in routers) {
    for (let j in routers[i]) {
      routers[i][j].use(async (ctx, next) => {
        try {
          await next();
        } catch (err) {
          console.log(`ERROR: ${err.stack}`);
          ctx.render('error', { err });
          ctx.type = 'application/json; charset=utf-8';
        }
      });
    }
  }

  configNurseRoutes(routers.nurse);
  configPatientRoutes(routers.patient);

  let unauthenticatedRoutesInfo = [];

  for (let i in routers) {
    unauthenticatedRoutesInfo = unauthenticatedRoutesInfo.concat(
      _.map(routers[i].unauthenticated.stack, layer => [layer.regexp, layer.methods])
    );

    for (let j in routers[i]) {
      routers[i][j].all('/*', (ctx, next) => {
        ctx.type = 'application/json; charset=utf-8';
        return next();
      });
    }

    app.use(routers[i].unauthenticated.routes());
    app.use(routers[i].unauthenticated.allowedMethods());
  }

  app.use( (ctx, next) => {
    let requireAuthentication = false;
    for (const [regexp, methods] of unauthenticatedRoutesInfo) {
      if (regexp.test(ctx.path) && methods.includes(ctx.method)) {
        requireAuthentication = true;
        break;
      }
    }
    if (!requireAuthentication) {
      return next();
    }
  });

  app.use(jwt({ secret: process.env.JWT_SHARED_SECRET }));

  for (let i in routers) {
    app.use(routers[i].authenticated.routes());
    app.use(routers[i].authenticated.allowedMethods());
  }
}
