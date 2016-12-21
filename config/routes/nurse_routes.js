'use strict';

const { sessions, patients, responses, requests } = require('../../api/controllers/nurse');

module.exports = (routers) => {
  // Router for endpoints that don't need authentication.
  routers.unauthenticated
    .post('/login', sessions.create);

  // Router for endpoints that require authentication.
  routers.authenticated
    .get('/patients', patients.index)
    .post('/responses', responses.create)
    .put('/requests', requests.update);
}
