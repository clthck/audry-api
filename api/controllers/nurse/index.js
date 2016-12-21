'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const camelize = require('underscore.string/camelize');
const controllers = {};

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    controllers[camelize(file.split('_controller.js')[0])] = require(`./${file}`);
  });

module.exports = controllers;
