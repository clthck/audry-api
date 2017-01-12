'use strict';

const {
  Patient, PatientTablet, Tablet, Bed, Room, Ward, User, Language
} = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { patientId, languageId, interfaceWardId, apnDeviceToken } = ctx.request.body;
    const { id: userId, tabletId } = ctx.state.user;
    const patient = await Patient.findById(patientId);

    patient.update({ languageId, interfaceWardId });
    const patientTablet = await PatientTablet.create({ patientId, tabletId, assignerId: userId });
    patientTablet.tablet = await patientTablet.getTablet();
    patientTablet.tablet.apnDeviceToken = apnDeviceToken;
    patientTablet.tablet.save();
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
  },

  getAssignedInfo: async (ctx, next) => {
    const { tabletId } = ctx.state.user;
    const patientTablet = await PatientTablet.findOne({
      where: { tabletId },
      include: [{
        model: Patient, as: 'patient',
        include: [{
          model: Language, as: 'language'
        }, {
          model: Ward, as: 'interfaceWard'
        }, {
          model: Bed, as: 'bed',
          include: [{
            model: Room, as: 'room',
            include: [{
              model: Ward, as: 'ward'
            }]
          }]
        }]
      }, {
        model: Tablet, as: 'tablet'
      }, {
        model: User, as: 'assigner'
      }]
    });

    ctx.render('patient/patients_tablets/get_assigned_info', { patientTablet });
    return next();
  }
};
