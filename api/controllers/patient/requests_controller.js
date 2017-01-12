'use strict';

const apn = require('apn');
const { Request, Patient, Nurse, WardService } = require('audry-common').models;
const notificationDefault = require('../../../config/apn/notification.config.base.js');

module.exports = {
  create: async (ctx, next) => {
    const { patientId, wardServiceId } = ctx.request.body;
    const patient = await Patient.findById(patientId, {
      include: [{
        model: Nurse, as: 'primaryNurse',
        include: [Nurse.associations.user]
      }]
    });
    const wardService = await WardService.findById(wardServiceId, {
      include: [WardService.associations.service]
    });
    const request = await Request.create({
      patientId, wardServiceId, status: 'level1'
    });
    const notification = new apn.Notification(Object.assign({}, notificationDefault, {
      alert: `Request from Patient (${patient.fullName}): ${wardService.service.name}`,
      payload: {
        patient: { id: patientId },
        request: { id: request.id }
      },
      topic: ctx.nurseAppBundleId
    }));
    ctx.nurseApnProvider.send(notification, patient.primaryNurse.user.apnDeviceToken);

    ctx.render('patient/requests/create', { request });
    return next();
  }
};
