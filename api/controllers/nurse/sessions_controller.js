'use strict';

const jwt = require('jsonwebtoken');
const { User, Nurse } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const { username, password } = ctx.request.body;
    let user = null;

    if (username && password) {
      user = await User.findOne({
        where: { username },
        include: [User.associations.nurse]
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
