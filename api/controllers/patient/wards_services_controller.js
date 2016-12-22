'use strict';

const {
  Patient, WardService, WardServiceCategory, ServiceCategory, Service
} = require('audry-common').models;

module.exports = {
  index: async (ctx, next) => {
    const { patientId } = ctx.query;
    const patient = await Patient.findById(patientId);
    const wardServiceCategories = await WardServiceCategory.findAll({
      where: {
        wardId: patient.interfaceWardId
      },
      include: [{
        model: ServiceCategory, as: 'serviceCategory',
        include: [{
          model: Service, as: 'services',
          include: [{
            model: WardService, as: 'serviceWards',
            where: { visible: true }
          }]
        }]
      }]
    });

    ctx.render('patient/wards_services/index', { wardServiceCategories });
    return next();
  }
};
