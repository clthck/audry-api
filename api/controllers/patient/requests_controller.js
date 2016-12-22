'use strict';

const { Request } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { patientId, wardServiceId } = ctx.request.body;
    const request = await Request.create({
      patientId, wardServiceId, status: 'level1'
    });

    ctx.render('patient/requests/create', { request });
    return next();
  }
};
