'use strict';

const apn = require('apn');
const { User, Request, Nurse, WardService } = require('audry-common').models;
const notificationDefault = require('../../../config/apn/notification.config.base.js');

module.exports = {
  update: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id, { include: [User.associations.nurse] });
    const { requestId, assigneeId } = ctx.request.body;
    const request = await Request.findById(requestId, {
      include: [{
        model: WardService, as: 'wardService',
        include: [WardService.associations.service]
      }]
    });

    request.assignerId = user.nurse.id;
    request.assigneeId = assigneeId;
    request.assignedAt = new Date();
    await request.save();

    const assignee = await Nurse.findById(assigneeId, {
      include: [Nurse.associations.user]
    });
    const notification = new apn.Notification(Object.assign({}, notificationDefault, {
      alert: `Patient Request Assigned by ${user.fullName}: ${request.wardService.service.name}`,
      payload: {
        request: {
          id: requestId,
          patientId: request.patientId,
          assignerId: request.assignerId,
          status: request.status,
          statusUpdatedAt: request.statusUpdatedAt
        }
      },
      topic: ctx.nurseAppBundleId
    }));
    ctx.nurseApnProvider.send(notification, assignee.user.apnDeviceToken);

    ctx.render('nurse/requests/update');
    return next();
  }
}
