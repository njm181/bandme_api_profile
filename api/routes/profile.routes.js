const { Router } = require('express');
const { check } = require('express-validator');
const { getUserProfile } = require('../controllers/profile.controller');

const router = Router();

//add express-validator
router.get('/user-profile', getUserProfile);


module.exports = router;