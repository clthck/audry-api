'use strict';

const { Patient, PatientTablet } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { patientId, languageId, interfaceWardId } = ctx.request.body;
    const { id: userId, tabletId } = ctx.state.user;
    const patient = await Patient.findById(patientId);

    patient.update({ languageId, interfaceWardId });
    const patientTablet = await PatientTablet.create({ patientId, tabletId, assignerId: userId });
    patientTablet.tablet = await patientTablet.getTablet();
    patientTablet.assigner = await patientTablet.getAssigner();

    ctx.render('patient/patients_tablets/create', { patientTablet });
    return next();
  },

  delete: async (ctx, next) => {
    const { patientId } = ctx.request.body;
    const { tabletId } = ctx.state.user;
    const affectedRows = await PatientTablet.destroy({ where: { patientId, tabletId } });
    ctx.render('patient/patients_tablets/destroy', { affectedRows });
    return next();
  }
};
