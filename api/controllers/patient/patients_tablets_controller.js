'use strict';

const { Patient, PatientTablet } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { patientId, languageId, interfaceWardId } = ctx.request.body;
    const { id: userId, tabletId } = ctx.state.user;
    const patient = await Patient.findById(patientId);

    patient.update({ languageId, interfaceWardId });
    const patientTablet = await PatientTablet.create({ patientId, tabletId, assignerId: userId });

    ctx.render('patient/patients_tablets/create', { patientTablet });
    return next();
  }
};
