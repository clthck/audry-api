'use strict';

const { User, Response } = require('audry-common').models;

module.exports = {
  create: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id, { include: [User.associations.nurse] });
    const { requestId, message, notes } = ctx.request.body;
    let response = await Response.findOne({ where: { requestId } });

    if (response === null) {
      response = await Response.create({ requestId, message, notes,
        responderId: user.nurse.id
      });
    } else {
      response = null;
    }

    ctx.render('nurse/responses/create', { response });
    return next();
  }
}
