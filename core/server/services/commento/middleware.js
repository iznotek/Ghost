const _ = require('lodash');
const logging = require('@tryghost/logging');
const crypto = require("crypto");
const errors = require('@tryghost/errors');
const tpl = require('@tryghost/tpl');
const config = require('../../../shared/config');
const membersService = require('../members');

const commento_server_url = config.get('commento:serverUrl');
const commento_secret_hex = config.get('commento:sso:secret');
const commento_secret = Buffer.from(commento_secret_hex, "hex");

const messages = {
    hmacUnresolved: 'hmac provided do not match with token and secret.',
    unconnected: 'You need to be authenticated.',
};

function hmac_sha256(encodedData, secret, format) {
    return crypto
      .createHmac('sha256', secret)
      .update(encodedData)
      .digest(format);
}

const ssoRedirect = async function (req, res, next) {
    if (!req.url.includes('token=') || !req.url.includes('hmac=')) {
        return next();
    }

    const token = req.query.token;
    const hmac = Buffer.from(req.query.hmac, "hex").toString('utf8');
    const hmac_expected = hmac_sha256(Buffer.from(token, "hex"), commento_secret, 'utf8')

    if (hmac !== hmac_expected) {
        throw new errors.ValidationError({message: tpl(messages.hmacUnresolved)});
    }

    const searchParams = new URLSearchParams('');
    searchParams.set('token', token);
    res.redirect(`${config.getSiteUrl()}commento?${searchParams.toString()}`);
}


const ssoPost = async function (req, res, next) {
    if (!req.url.includes('token=')) {
      return next();
    }

    const member = await membersService.ssr.getMemberDataFromSession(req, res);
    if (!member) {
      throw new errors.ValidationError({message: tpl(messages.unconnected)});
    }

    const token = req.query.token;
    var payload = {
        "token": token,
        "email": member.email,
        "name":  member.name,
        "link":  '',
        "photo": req.query.avatar // member.avatar_image 
    }

    const out_hmac = hmac_sha256(JSON.stringify(payload), commento_secret, 'hex');
    const payload_hex = Buffer.from(JSON.stringify(payload)).toString('hex'); 

    const searchParams = new URLSearchParams('');
    searchParams.set('payload', payload_hex);
    searchParams.set('hmac', out_hmac);
    res.redirect(`${commento_server_url}/api/oauth/sso/callback?${searchParams.toString()}`);
};

module.exports = {
    ssoRedirect,
    ssoPost
};
