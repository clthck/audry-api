'use strict';

const { User, Request } = require('audry-common').models;

module.exports = {
  update: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id, { include: [User.associations.nurse] });
    const { requestId, assigneeId } = ctx.request.body;
    const request = await Request.findById(requestId);

    request.assigneeId = assigneeId;
    request.assignedAt = new Date();
    await request.save();
    ctx.render('nurse/requests/update');
    return next();
  }
}
