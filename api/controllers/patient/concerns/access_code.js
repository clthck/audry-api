'use strict';

const { User } = require('audry-common').models;

module.exports = {
  confirm: async (ctx, next) => {
    const { accessCode } = ctx.request.body;
    const user = await User.findById(ctx.state.user.id);

    if (user.accessCode === accessCode) {
      return next();
    } else {
      ctx.body = {
        success: false,
        error: 'invalid access code'
      };
    }
  }
};
