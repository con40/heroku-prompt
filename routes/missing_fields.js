const router = require('express').Router();
const { urlencoded } = require('body-parser');
const csurfProtection = require('csurf')({ cookie: true });
const { auth0ManagementClient, redirectToAuth0 } = require('../lib/auth0');
const { badRequestError } = require('../lib/error');
const logger = require('../lib/logger').createLogger('routes/account_setup');
const { verify } = require('jsonwebtoken');


// endpoints

router.get('/', csurfProtection, (req, res) => {
  const { state, session_token } = req.query;

  // capture state param passed by Auth0
  if (!state) {
    throw badRequestError(`Missing state parameter.`)
  }
  req.appSession.state = state;

  // validate session token passed by Auth0 rule
  if (!session_token) {
    throw badRequestError(`Missing session_token parameter`)
  }
  let payload;
  try {
    payload = verify(session_token, process.env.SESSION_TOKEN_SECRET);
  } catch (err) {
    throw badRequestError(`Session token: ${err.message}`);
  }
  console.log('session_token subject:', payload.sub);
  console.log('Current session user:', req.oidc.user.sub);
  if (payload.sub !== req.oidc.user.sub) {
    throw badRequestError(`Session token subject does not match current session user`)
  }

  // get profile custom claim from OIDC user object (ID Token)
  const profile = req.oidc.user[`${process.env.BASE_URL}/claims/profile`];
  if (!profile) {
    throw badRequestError(`Profile custom claim not found in the OIDC user object`)
  }
  logger.info('profile:', profile);

  res.render('missing_fields', {
    title: 'Account Setup',
    message: 'We just need a bit more information so we can finish setting up your account',
    given_name: profile.root.given_name,
    family_name: profile.root.family_name,
    accept_tnc: profile.user_metadata.tnc_v1_accepted ? 'on' : '',
    csrfToken: req.csrfToken()
  });
});

router.post('/', urlencoded({ extended: true }), csurfProtection, async (req, res) => {
  const { given_name, family_name, accept_tnc } = req.body;
  const name = `${given_name} ${family_name}`;
  const tnc_v1_accepted = accept_tnc === 'on';

  await auth0ManagementClient.updateUser({ id: req.oidc.user.sub }, {
    given_name,
    family_name,
    name,
    user_metadata: { tnc_v1_accepted }
  });
  logger.info(`Primary user '${req.oidc.user.sub}' updated with account setup fields`);

  return redirectToAuth0(req, res);
});

module.exports = router;
