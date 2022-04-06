const debug = require('@tryghost/debug')('commento');
const {URL} = require('url');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('../../../shared/express');
const sentry = require('../../../shared/sentry');
const config = require('../../../shared/config');
const commentoService = require('../../services/commento');
const shared = require('../shared');

const membersService = require('../../services/members');
const middleware = membersService.middleware;
const errorHandler = require('@tryghost/mw-error-handler');

module.exports = function setupMembersApp() {
    debug('Members App setup start');
    const membersApp = express('commento');

    // Members API shouldn't be cached
    membersApp.use(shared.middleware.cacheControl('private'));

    // Support CORS for requests from the frontend
    const commento_server_url = config.get('commento:serverUrl');
    const serverUrl = new URL(commento_server_url);
    membersApp.use(cors(serverUrl.origin));

    // Commento
    membersApp.get('/sso', // shared.middleware.brute.membersAuth,  
        (req, res, next) => commentoService.middleware.ssoCheck(req, res, next));

    debug('Commento App setup end');

    return membersApp;
};
