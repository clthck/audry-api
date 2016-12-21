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

  destroy: async (ctx, next) => {
    const affectedRows = await PatientTablet.destroy({ where: { id: ctx.params.id } });
    ctx.render('patient/patients_tablets/destroy', { affectedRows });
    return next();
  },

  update: async (ctx, next) => {
    const { languageId } = ctx.request.body;
    const patientTablet = await PatientTablet.findById(ctx.params.id, {
        include: [PatientTablet.associations.patient]
    });
    const updatedPatient = await patientTablet.patient.update({ languageId });
    
    ctx.render('patient/patients_tablets/update', { updatedPatient });
    return next();
  }
};
