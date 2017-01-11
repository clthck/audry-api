'use strict';

const jwt = require('jsonwebtoken');
const { User, Nurse, NurseStation } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { username, password } = ctx.request.body;
    let user = null;

    if (username && password) {
      user = await User.findOne({
        where: { username },
        include: [{
          model: Nurse, as: 'nurse',
          include: [{
            model: NurseStation, as: 'nurseStation',
            include: [NurseStation.associations.ward]
          }]
        }]
      });

      if (user && user.nurse) {
        if (user.authenticate(password)) {
          const payload = { id: user.id, lastLoggedInAt: Date.now };
          user.accessToken = jwt.sign(payload, process.env.JWT_SHARED_SECRET, { expiresIn: '7 days' });
        } else {
          user = -1;
        }
      } else {
        user = null;
      }
    }
    ctx.render('nurse/sessions/create', { user });      
    return next();
  }
}
