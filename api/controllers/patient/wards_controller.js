'use strict';

const { User, Ward } = require('audry-common').models;

module.exports = {
  index: async (ctx, next) => {
    const { id: userId, staffType } = ctx.state.user;
    const user = await User.findById(userId, { include: [User.associations[staffType]] });
    const staffHospital = await user[staffType].getHospital();
    const wards = await Ward.findAllByHospitalId(staffHospital.id);
    ctx.render('patient/wards/index', { wards });
    return next();
  }
};
