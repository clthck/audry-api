'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const controllers = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    controllers[file.split('_controller.js')[0]] = require(`./${file}`);
  });

module.exports = controllers;
