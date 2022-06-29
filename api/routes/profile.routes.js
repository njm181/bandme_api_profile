const { Router } = require('express');
const { check } = require('express-validator');
const { getUserProfileController, editUserProfile, editUserPost, deleteUserFriend, deleteUserPost, postFollowUser, createUserPost } = require('../controllers/profile.controller');

const router = Router();

//add express-validator
router.get('/user-profile', getUserProfileController);

router.post('/user-follow', postFollowUser);

router.put('/edit-profile', editUserProfile);

router.post('/create-post', createUserPost);

router.put('/edit-post', editUserPost);

router.delete('/delete-friend', deleteUserFriend);

router.delete('/delete-post', deleteUserPost);


module.exports = router;