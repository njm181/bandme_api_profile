const { Router } = require('express');
const { check } = require('express-validator');
const { getUserProfile, editUserProfile } = require('../controllers/profile.controller');

const router = Router();

//add express-validator
router.get('/user-profile', getUserProfile);

router.put('/edit-profile', editUserProfile);


module.exports = router;