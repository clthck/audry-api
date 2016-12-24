'use strict';

const accessCode = require('../../api/controllers/patient/concerns/access_code.js');
const {
  sessions, patients, wards, languages, patientsTablets, wardsServices, requests
} = require('../../api/controllers/patient');

module.exports = (routers) => {
  // Router for endpoints that don't need authentication.
  routers.unauthenticated
    .post('/unlock', sessions.create)
    .get('/wardsServices', wardsServices.index)
    .post('/requests', requests.create);

  // Router for endpoints that require authentication.
  routers.authenticated
    .get('/patients', patients.index)
    .get('/wards', wards.index)
    .get('/languages', languages.index)
    .post('/patientsTablets', accessCode.confirm, patientsTablets.create)
    .delete('/patientsTablets/:id', accessCode.confirm, patientsTablets.destroy)
    .put('/patientsTablets/:id', patientsTablets.update)
    .get('/patientsTablets/getAssignedInfo', patientsTablets.getAssignedInfo);
}
