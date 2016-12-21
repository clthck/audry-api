'use strict';

const jwt = require('jsonwebtoken');
const { User, Nurse, Tablet } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { udid, accessCode } = ctx.request.body;
    let user = null;

    if (udid && accessCode) {
      const userAssoc = User.associations;
      user = await User.findOne({
        where: { accessCode },
        include: [userAssoc.nurse, userAssoc.physician, userAssoc.supervisor]
      });

      const staff = user && (user.nurse || user.physician || user.supervisor);
      const tablet = await Tablet.findOne({ where: { udid } });

      if (staff && tablet) {
        let staffType = null;
        for (const type of ['nurse', 'physician', 'supervisor']) {
          if (staff == user[type]) {
            staffType = type;
            break;
          }
        }

        const staffHospital = await staff.getHospital();
        if (staffHospital.id === tablet.hospitalId) {
          const payload = {
            id: user.id,
            staffType,
            tabletId: tablet.id,
            lastLoggedInAt: Date.now
          };
          user.accessToken = jwt.sign(payload, process.env.JWT_SHARED_SECRET, { expiresIn: '7 days' });
        } else {
          user = -1;
        }
      } else {
        user = null;
      }
    }
    ctx.render('patient/sessions/create', { user });      
    return next();
  }
}
