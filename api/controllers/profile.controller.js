const { response } = require("express");
const ProfileService = require("../../services/profile.service");


const getUserProfile = async(req, res = response) => {
    //looking at cors and helmet documentation to validate request https://www.npmjs.com/package/cors // https://www.npmjs.com/package/helmet
    //console.log(JSON.stringify(req.headers));//looking at express-validator documentation to validate headers https://express-validator.github.io/docs/
    const token = req.headers['auth-token'];
    if(token == '1234567') { //if the token comes in the request
        const profileService = new ProfileService();
        const userProfileData = await profileService.getUserProfile(token);
        let response;
        if(userProfileData.exist){
            response = res.status(200).json({
                exist: userProfileData.exist,
                user_profile: userProfileData.user_data,
                message: 'user exist'
            });
        } else {
            response = res.status(200).json({
                exist: userProfileData.exist,
                user_profile: userProfileData.user_data,
                message: 'user does not exist'
            });
        }

        return response;
        
    } else {
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    }
}

const editUserProfile = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token == '1234567'){ //if the token comes in the request
        const profileService = new ProfileService();
        const userProfileEdited = await profileService.editUserProfile(token, payload);
        let response;
        if(userProfileEdited.was_edited){
            response = res.status(200).json({
                was_edited: userProfileEdited.was_edited,
                user_data_edited: userProfileEdited.user_new_data,
                message: 'User was edited successfully'
            });
        }else{
            response = res.status(200).json({
                was_edited,
                user_data_edited: userProfileEdited.user_new_data,
                message: 'User was not edited'
            });
        }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}

const editUserPost = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token == '1234567'){ //if the token comes in the request
        const profileService = new ProfileService();
        const userPostEdited = await profileService.editUserPost(token, payload);
        let response;
        if(userPostEdited.was_edited){
            response = res.status(200).json({
                was_edited: userPostEdited.was_edited,
                user_post_edited: userPostEdited.user_post_edited,
                message: 'Post was edited successfully'
            });
        }else{
            response = res.status(200).json({
                was_edited:userPostEdited.was_edited,
                user_post_edited: userPostEdited.user_post_edited,
                message: 'Post was not edited'
            });
        }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}

const deleteUserFriend = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token == '1234567'){ //if the token comes in the request
        const profileService = new ProfileService();
        const userEdited = await profileService.deleteUserFriend(token, payload);
        let response;
        if(userEdited.was_deleted_friend){
            response = res.status(200).json({
                was_edited: userEdited.was_deleted_friend,
                user_post_edited: userEdited.user_data_edited,
                message: 'Friend was deleted successfully'
            });
        }else{
            response = res.status(200).json({
                was_edited:userEdited.was_deleted_friend,
                user_data_edited: userEdited.user_data_edited,
                message: 'Friend was not deleted'
            });
        }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}

const deleteUserPost = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token == '1234567'){ //if the token comes in the request
        const profileService = new ProfileService();
        const userEdited = await profileService.deleteUserPost(token, payload);
        let response;
        if(userEdited.was_deleted_post){
            response = res.status(200).json({
                was_edited: userEdited.was_deleted_post,
                user_post_edited: userEdited.user_data_edited,
                message: 'Post was deleted successfully'
            });
        }else{
            response = res.status(200).json({
                was_edited:userEdited.was_deleted_post,
                user_data_edited: userEdited.user_data_edited,
                message: 'Post was not deleted'
            });
        }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}


const postFollowUser = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token == '1234567'){ //if the token comes in the request
        const profileService = new ProfileService();
        const userFollowed = await profileService.postFollowUser(token, payload);
        let response;
        if(userFollowed.was_new_friend_added){
            response = res.status(200).json({
                was_new_friend_added: userFollowed.was_new_friend_added,
                user_data: userFollowed.user_data,
                message: 'Following new user successfully'
            });
        }else{
            response = res.status(200).json({
                was_new_friend_added:userFollowed.was_new_friend_added,
                user_data: userFollowed.user_data,
                message: 'Could not follow new user'
            });
        }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}

module.exports = {
    getUserProfile,
    editUserProfile,
    editUserPost,
    deleteUserFriend,
    deleteUserPost,
    postFollowUser,
}