'use strict';

const { User, Nurse } = require('audry-common').models;

module.exports = {
  getOtherNurses: async (ctx, next) => {
    const user = await User.findById(ctx.state.user.id, { include: [User.associations.nurse] });
    const nurses = await Nurse.findAll({
      where: { nurseStationId: user.nurse.nurseStationId },
      include: [Nurse.associations.user]
    });

    ctx.render('nurse/nurses/get_other_nurses', { nurses });
    return next();
  }
}
