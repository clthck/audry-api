'use strict';

const apn = require('apn');
const { User, Response, Request, Patient, PatientTablet } = require('audry-common').models;
const notificationDefault = require('../../../config/apn/notification.config.base.js');

module.exports = {
  create: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id, { include: [User.associations.nurse] });
    const { requestId, message, notes } = ctx.request.body;
    let response = await Response.findOne({ where: { requestId } });

    if (response === null) {
      response = await Response.create({ requestId, message, notes,
        responderId: user.nurse.id
      });
      const request = await Request.findById(requestId, {
        include: [{
          model: Patient, as: 'patient',
          include: [{
            model: PatientTablet, as: 'patientTablet',
            include: [PatientTablet.associations.tablet]
          }]
        }]
      });
      const notification = new apn.Notification(Object.assign({}, notificationDefault, {
        alert: `Response from Primary Nurse (${user.fullName}): ${message}`,
        payload: {
          request: { id: requestId }
        },
        topic: ctx.patientAppBundleId
      }));
      ctx.patientApnProvider.send(notification, request.patient.patientTablet.tablet.apnDeviceToken);
    } else {
      response = null;
    }

    ctx.render('nurse/responses/create', { response });
    return next();
  }
}
