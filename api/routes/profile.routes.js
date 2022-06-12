const { Router } = require('express');
const { check } = require('express-validator');
const { getUserProfile, editUserProfile, editUserPost, deleteUserFriend, deleteUserPost } = require('../controllers/profile.controller');

const router = Router();

//add express-validator
router.get('/user-profile', getUserProfile);

router.put('/edit-profile', editUserProfile);

router.put('/edit-post', editUserPost);

router.delete('/delete-friend', deleteUserFriend);

router.delete('/delete-post', deleteUserPost);


module.exports = router;