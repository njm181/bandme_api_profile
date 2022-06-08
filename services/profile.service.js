class ProfileService {

    constructor(){}

    async getUserProfile(token){
        //1.obtengo el token y mando a desencriptarlo para obtener el id del usuario en mongo
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        //3.devolver objeto con los datos del usuario
        let userProfile;
        if(token === '1234567'){ //simulacion de verificacion del token//middleware que valide el token
            userProfile = {
                exist: true,
                user_data: {
                    name: 'Pipo',
                    surname: 'Gorosito',
                    social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
                    description: 'Esto es una description de Pipo Gorosito',
                    post_list: [{id: 1, title: 'Datos del posteo numero 1'}, {id: 2, title: 'Datos del posteo numero 2'}, {id: 3, title: 'Datos del posteo numero 3'}, {id: 4, title: 'Datos del posteo numero 4'}],
                    friends_list: [{id: 1, name: 'Amigo Numero 1'}, {id: 2, name: 'Amigo Numero 2'}, {id: 3, name: 'Amigo Numero 3'}, {id: 4, name: 'Amigo Numero 4'}],
                    image: 'urlimage.com'
                }
            }
        } else {
            userProfile = {
                exist: false,
                user_data: {}
            }
        }
        return userProfile;
    };

    async editUserProfile(token, payload){
        
        //1.obtengo el token y mando a desencriptarlo para obtener el id del usuario en mongo
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        //3.en userNewData se espera una lista con redes sociales, una description y una imagen, puede venir con algo o no
        //4.armo un nuevo objeto entre la data vieja y la nueva y mando a guardar
        //5.la respuesta es un boolean y un message
        //====
        //6.En la app configurar despues de un success hacer un auto refresh para mostrar la nueva data
        /* let dataToEditMocked = {
            description: 'Esto es una descripcion de un usuario editada',
            image: '',
            social_media: [{name: 'instagram', url: 'instagramEditado.com'}, {name: 'youtube', url: ''}, {name: 'spotify', url: 'spotifyEditado.com'}],
        } */

        let dataFromMongoMocked = {
            description: 'Esto es una descripcion de un usuario',
            image: 'urlimageVieja.com',
            social_media: [{name: 'instagram', url: ''}, {name: 'youtube', url: ''}, {name: 'spotify', url: ''}],
        }

        let userProfileEdited;

        if(token === '1234567'){
            let getElementEdited = payload.social_media.filter(function(element){
                if(element.url != ''){
                    return element;
                }
            });
            dataFromMongoMocked.social_media.forEach((element, index) => {
                let elementEdited = getElementEdited.find(obj => {
                    if (obj.name == element.name) {
                        return obj;
                    }
                });
                
                if(elementEdited != undefined && elementEdited.name == element.name) {
                    element.url = elementEdited.url;
                }
            })

            userProfileEdited = {
                was_edited: true,
                user_new_data: {
                    description: (payload.description == '') ? dataFromMongoMocked.description : payload.description,
                    image: (payload.image == '') ? dataFromMongoMocked.image : payload.image,
                    social_media: dataFromMongoMocked.social_media
                }
            }
        }else{
            userProfileEdited = {
                was_edited: false,
                user_new_data: {}
            }
        }
        return userProfileEdited;
    }

}

module.exports = ProfileService;