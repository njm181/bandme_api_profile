class ProfileService {

    constructor(){}

    async getUserProfile(token){
        //1.obtengo el token y mando a desencriptarlo para obtener el id del usuario en mongo
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        //3.devolver objeto con los datos del usuario
        let userProfile;
        if(token === '1234567'){ //simulacion de verificacion del token
            userProfile = {
                exist: true,
                user_data: {
                    name: 'Pipo',
                    surname: 'Gorosito',
                    social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
                    description: 'Esto es una description de Pipo Gorosito',
                    post_list: [{id: 1, title: 'Datos del posteo numero 1'}, {id: 2, title: 'Datos del posteo numero 2'}, {id: 3, title: 'Datos del posteo numero 3'}, {id: 4, title: 'Datos del posteo numero 4'}],
                    friends_list: [{id: 1, name: 'Amigo Numero 1'}, {id: 2, name: 'Amigo Numero 2'}, {id: 3, name: 'Amigo Numero 3'}, {id: 4, name: 'Amigo Numero 4'}]
                }
            }
        } else {
            userProfile = {
                exist: false,
                user_data: {}
            }
        }
        return userProfile;
    }

}

module.exports = ProfileService;