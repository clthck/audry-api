'use strict';

const { User, Patient } = require('audry-common').models;

module.exports = {
  index: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id, { include: [User.associations.nurse] });
    let { patientsScope, requestStatus, sortBy } = ctx.query;

    if (requestStatus === 'requestOpen') {
      requestStatus = ['level1', 'level2', 'leve3'];
    }

    const patients = await Patient.findAllWithCustomOptions({
      patientsScope, requestStatus, sortBy, user
    });

    ctx.render('nurse/patients/index', { patients });
    return next();
  }
}
