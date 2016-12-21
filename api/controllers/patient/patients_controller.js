'use strict';

const { User, Patient } = require('audry-common').models;

module.exports = {
  index: async (ctx, next) => {
    // Finds all unassigned patients within the same hospital.
    const { id: userId, staffType } = ctx.state.user;
    const user = await User.findById(userId, { include: [User.associations[staffType]] });
    const staffHospital = await user[staffType].getHospital();
    const patients = await Patient.findAllUnassigned(staffHospital.id);

    ctx.render('patient/patients/index', { patients });
    return next();
  }
}
