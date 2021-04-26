const { AuthenticationClient, ManagementClient } = require('auth0');

const auth0AuthenticationClient = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

const auth0ManagementClient = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

function redirectToAuth0 (req, res) {
  // end local prompt session and redirect to Auth0 /continue endpoint
  const returnTo = `https://${process.env.AUTH0_DOMAIN}/continue?state=${req.appSession.state}`;
  res.oidc.logout({ returnTo });
}

module.exports = {
  auth0AuthenticationClient,
  auth0ManagementClient,
  redirectToAuth0
};
