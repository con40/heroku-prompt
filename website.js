const router = require('express').Router();
const { auth0ManagementClient } = require('./lib/auth0');
const logger = require('./lib/logger').createLogger('website');
const { auth } = require('express-openid-connect');

// Auth0 tenant config cache
let auth0TenantConfig;

// configure authentication
router.use(auth({ 
  authorizationParams: {
    scope: 'openid profile email phone'
  },
  authRequired: false,
}));

router.use(async (req, res, next) => {
  try {
    // make user data available in all views
    res.locals.user = req.oidc.user;

    // cache Auth0 tenant config on first request
    if (!auth0TenantConfig) {
      const tenantSettings = await auth0ManagementClient.getTenantSettings();
      auth0TenantConfig = {
        colors: tenantSettings.universal_login.colors,
        icon: tenantSettings.picture_url  
      }
      logger.info(`Config loaded from Auth0 tenant`);
    }
    
    // load config into all views
    res.locals.config = auth0TenantConfig;

    next();
  } catch (err) {
    next(err);
  }
});

// website routes
router.use('/', require('./routes'));

module.exports = router;
