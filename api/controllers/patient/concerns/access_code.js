'use strict';

const { User } = require('audry-common').models;

module.exports = {
  confirm: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id);
    let { accessCode } = ctx.request.body;
    
    accessCode = accessCode || ctx.header.accesscode;

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
