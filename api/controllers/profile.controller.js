const { response } = require("express");
const ProfileService = require("../../services/profile.service");


const getUserProfile = async(req, res = response) => {
    //looking at cors and helmet documentation to validate request https://www.npmjs.com/package/cors // https://www.npmjs.com/package/helmet
    //console.log(JSON.stringify(req.headers));//looking at express-validator documentation to validate headers https://express-validator.github.io/docs/
    const token = req.headers['auth-token'];
    if(token == '1234567') {
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

    if(token == '1234567'){
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
                message: 'User was no edited'
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
    editUserProfile
}