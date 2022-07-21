const { response } = require("express");
const profileService = require("../../services/profile.service");

//Verificado
const getUserProfileController = async(req, res = response) => {
    //looking at cors and helmet documentation to validate request https://www.npmjs.com/package/cors // https://www.npmjs.com/package/helmet
    //console.log(JSON.stringify(req.headers));//looking at express-validator documentation to validate headers https://express-validator.github.io/docs/
    const token = req.headers['auth-token'];
    console.log('token recibido desde el body controller: '+token);
    if(token != undefined) { //if the token comes in the request
        try{ 
        //const profileService = new profileService();
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        console.log('RESULTADO DESDE CONTROLLER: ' + JSON.stringify(uid));
        const userProfile = await profileService.getUserProfilByUid(uid);
        let response;
        if(userProfile.exist){
            response = res.status(200).json({
                exist: userProfile.exist,
                user_profile: userProfile.user_data,
                message: 'user exist'
            });
        } else {
            response = res.status(200).json({
                exist: userProfile.exist,
                user_profile: userProfile.user_data,
                message: 'user does not exist'
            });
        }
    }else{
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
        return response;
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } else {
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    }
}




//Verificado
const editUserProfile = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token != undefined){
        try{
        //const profileService = new profileService();
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const userProfileEdited = await profileService.editUserProfile(uid, payload);
        let response;
        if(userProfileEdited.was_edited){
            response = res.status(200).json({
                was_edited: userProfileEdited.was_edited,
                user_data_edited: userProfileEdited.user_new_data,
                message: 'User was edited successfully'
            });
        }else{
            response = res.status(200).json({
                was_edited: userProfileEdited.was_edited,
                user_data_edited: userProfileEdited.user_new_data,
                message: 'User was not edited'
            });
        }
    }else{
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }

    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}
//Verificado
const createUserPost = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;
    console.log('token para crear post: ' + token);
    if(token != undefined){ //if the token comes in the request
        try{
        //const profileService = new profileService();
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const userPostCreated = await profileService.createUserPostService(uid, payload);
        let response;
        if(userPostCreated.was_created){
            response = res.status(200).json({
                was_created: userPostCreated.was_created,
                user_post_created: userPostCreated.user_post_created,
                message: 'Post was edited successfully'
            });
        }else{
            response = res.status(200).json({
                was_created:userPostCreated.was_created,
                user_post_created: userPostCreated.user_post_created,
                message: 'Post was not edited'
            });
        }
    }else{
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}
//Verificado
const editUserPost = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;
    if(token != undefined){ //if the token comes in the request
        try{
        const profileService = new profileService();
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const userPostEdited = await profileService.editUserPost(uid, payload);
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
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}


//Verificado
const deleteUserFriend = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token != undefined){ //if the token comes in the request
        //const profileService = new profileService();
        try{
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const userEdited = await profileService.deleteUserFriend(uid, payload);
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
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}


//Verificado
const deleteUserPost = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token != undefined){ //if the token comes in the request
        //const profileService = new profileService();
        try{
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const userEdited = await profileService.deleteUserPost(uid, payload);
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
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}

//Verificado
const postFollowUser = async(req, res = response) => {
    const token = req.headers['auth-token'];
    const { payload } = req.body;

    if(token != undefined){ //if the token comes in the request
        //const profileService = new profileService();
        try{
        const {uid} = await profileService.decodeToken(token);
        if(uid != '' && uid != undefined && uid != null){
        const userFollowed = await profileService.postFollowUser(uid, payload);
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
        console.log('No se pudo autenticar la identidad por que el token es incorrecto ');
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    } catch(error){
        console.log('No se pudo autenticar la identidad: ', error);
        return res.status(500).json({
            message: 'No se pudo autenticar la identidad'
        });
    }
    }else{
        return res.status(400).json({
            message: 'Error request by bad token'
        });
    } 
}

module.exports = {
    getUserProfileController,
    editUserProfile,
    editUserPost,
    deleteUserFriend,
    deleteUserPost,
    postFollowUser,
    createUserPost
}