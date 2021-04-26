const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

// endpoints

router.get(`/`, (req, res) => {
  res.send('Prompt App');
});

// child routes

router.use(`/missing_fields`, requiresAuth(), require('./missing_fields'));
router.use(`/tnc`, requiresAuth(), require('./tnc'));

module.exports = router;
