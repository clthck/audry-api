'use strict';

const { Language } = require('audry-common').models;

module.exports = {
  index: async (ctx, next) => {
    const languages = await Language.findAll({
      order: [ ['id', 'ASC'] ]
    });
    ctx.render('patient/languages/index', { languages });
    return next();
  }
};
