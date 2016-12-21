'use strict';

const {
  sessions, patients, wards, languages, patientsTablets
} = require('../../api/controllers/patient');

module.exports = (routers) => {
  // Router for endpoints that don't need authentication.
  routers.unauthenticated
    .post('/unlock', sessions.create);

  // Router for endpoints that require authentication.
  routers.authenticated
    .get('/patients', patients.index)
    .get('/wards', wards.index)
    .get('/languages', languages.index)
    .post('/assignTablet', patientsTablets.create);
}
