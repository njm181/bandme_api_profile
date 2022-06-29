const axios = require('axios').default;
const User = require('../models/user.model');
const mongoose = require('mongoose');
const Post = require('../models/post.model');

class ProfileService {

    constructor(){}

    async decodeToken(userToken){
        try{
            const {data:response} = await axios.post('http://localhost:5001/api/v1/login/validate/user-identity', {
            token:userToken
        });
            return response;
        }catch(error){
            console.log("Error catch: " + error);
        }
    }

    async getUserProfilByUid(userUid){
        //1.con ese id de usuario de mongo obtengo los datos del usuario
        //2.devolver objeto con los datos del usuario
        let userProfile = {
            exist: false,
            user_data: {
                email: ''
            }
        }
        try{
            const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);
            const { email, user_type, description, profile_photo, social_media, first_name, last_name, account_status } = userProfileDb;
            userProfile = {
                exist: true,
                user_data: {
                    email,
                    user_type,
                    description,
                    profile_photo,
                    social_media,
                    first_name,
                    last_name,
                    account_status
                }
            };
        }catch(error){
            console.log("Error al obtener usuario de la base de datos: " + error)
            userProfile = {
                exist: false,
                user_data: {
                    email: 'catch: not found'
                }
            }
        }
        /*  userProfile = {
            exist: true,
            user_data: {
                name: 'Pipo',
                surname: 'Gorosito',
                social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
                description: 'Esto es una description de Pipo Gorosito',
                post_list: [{id: "1", title: 'Datos del posteo numero 1'}, {id: "2", title: 'Datos del posteo numero 2'}, {id: "3", title: 'Datos del posteo numero 3'}, {id: "4", title: 'Datos del posteo numero 4'}],
                friends_list: [{id: "1", name: 'Amigo Numero 1'}, {id: "2", name: 'Amigo Numero 2'}, {id: "3", name: 'Amigo Numero 3'}, {id: "4", name: 'Amigo Numero 4'}],
                image: 'urlimage.com'
            }
        } */
        return userProfile;
    };

    async editUserProfile(userUid, payload){
        //1.con ese id de usuario de mongo obtengo los datos del usuario
        //2.en userNewData se espera una lista con redes sociales, una description y una imagen, puede venir con algo o no
        //3.armo un nuevo objeto entre la data vieja y la nueva y mando a guardar
        //4.la respuesta es un boolean y un message
        //====
        //5.En la app configurar despues de un success hacer un auto refresh para mostrar la nueva data
        let userProfileEdited = {
            was_edited: false,
            user_new_data: {}
        };
        try{
            const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);
            const { email, user_type, description, profile_photo, social_media, first_name, last_name, account_status } = userProfileDb;
            const userProfileByMongo = {
                    email,
                    user_type,
                    description,
                    profile_photo,
                    social_media,
                    first_name,
                    last_name,
                    account_status
            };
            let getElementEdited = [];
            getElementEdited = payload.social_media.filter(function(element){
                if(element.url != ''){
                    return element;
                }
            });
            userProfileByMongo.social_media.forEach((element, index) => {
                console.log("Elemento del for each: " + element)
                let elementEdited = getElementEdited.find(obj => {
                    if (obj.name == element.name) {
                        console.log("Elemento del find: " + JSON.stringify(obj));
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
                    description: (payload.description == '') ? userProfileByMongo.description : payload.description,
                    image: (payload.image == '') ? userProfileByMongo.profile_photo : payload.image,
                    social_media: userProfileByMongo.social_media
                }
            }

            const update = userProfileDb.updateOne({description: description, profile_photo: profile_photo, social_media: social_media}, function(error, result) {
                if(error){
                    console.log("Error al actualizar perfil del usuario en DB: " + error);
                }else{
                    console.log("Perfil actualizado en DB: " + JSON.stringify(result));
                }
            });

        }catch(error){
            console.log("Error CATCH: " + error)
            userProfileEdited = {
                was_edited: false,
                user_new_data: {}
            }
        }
        return userProfileEdited;
    }

    async createUserPostService(userUid, payload){
        //1.Creo un objeto nuevo con el uid del usuario y la data del posteo todos campos del mismo objeto, sin encapsular
        //chequear nullable, undefined
        const newPost = new Post({
            id_owner: userUid,
            title: payload.title,
            street: payload.street,
            street_number: payload.street_number,
            postal_code: payload.postal_code,
            description: payload.description,
            date: payload.date,
            time: payload.time,
            checkbox: payload.checkbox,
        });

        console.log("datos para guardar: " + JSON.stringify(newPost));
        try{
            //2.mando guardar y crear documento en mongo
            //3.obtengo id del documento creado de mongo
            const result = await newPost.save();
            console.log("respuesta de guardar posteo en la base de datos: " + JSON.stringify(result._id));
            //4.voy a buscar mediante el uid los datos del usuario y le inyecto el id del posteo a sus array de ids de posteos
            const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);
            userProfileDb.post_list.push(result._id);
            const update = userProfileDb.updateOne({post_list: userProfileDb.post_list }, function(error, result) {
                if(error){
                    console.log("Error al actualizar perfil del usuario en DB: " + error);
                }else{
                    console.log("Perfil actualizado en DB con nuevo posteo: " + JSON.stringify(result));
                }
            });
        }catch(error){
            console.log("Error no se pudo guardar posteo en la base de datos: " + error);
        }
        
        let response = {
            was_created: true,
            user_post_created: {}
        }
        return response;

    }

    async editUserPost(userUid, payload){
        //1.con ese id de usuario de mongo obtengo los datos del usuario
        //2.Dentro de esos datos tiene que existir una lista de posteos historicos que el usuario creo
        const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);
            const { email, user_type, description, profile_photo, social_media, first_name, last_name, account_status } = userProfileDb;
            const userProfileByMongo = {
                    email,
                    user_type,
                    description,
                    profile_photo,
                    social_media,
                    first_name,
                    last_name,
                    account_status
            };
        //3.Del Payload puedo obtener el id de posteo que se quiere editar,
        //4.Entonces recorro la lista de posteos historicos y comparo los ID con el ID que viene en Payload
        //5.Una vez que encuentre el posteo que se quiere editar obtengo sus datos
        //6.Datos del posteo: Title, street, street number, postal code, description, date, time, checkbox
        //7.Comparo los campos contra los valores que trae Payload y aquellos que son distintos son pisados por los que trae Payload
        console.log('Payload que llega al service para editar un posteo: ' + JSON.stringify(payload));
        //mock user data
        const userDataFromMongo = {
            name: 'Pipo',
            surname: 'Gorosito',
            social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
            description: 'Esto es una description de Pipo Gorosito',
            post_list: [
                {
                    id: "1",
                    title: 'Datos del posteo numero 1',
                    street: 'Avenida Nazca',
                    street_number: '4312',
                    postal_code: '1419',
                    description: 'Estos es una descripcion del posteo que se publico',
                    date: '15/10/22',
                    time: '16:30',
                    checkbox: {advertising: 'false', search: 'true'}
                }, 
                {
                    id: "2",
                    title: 'Datos del posteo numero 2',
                    street: 'Avenida San Martin',
                    street_number: '5012',
                    postal_code: '1612',
                    description: 'Estos es una descripcion del posteo que se publico',
                    date: '12/08/22',
                    time: '20:30',
                    checkbox: {advertising: 'true', search: 'false'}
                }, {
                    id: "3",
                    title: 'Datos del posteo numero 3',
                    street: 'Terrada',
                    street_number: '3122',
                    postal_code: '1312',
                    description: 'Estos es una descripcion del posteo que se publico',
                    date: '23/09/22',
                    time: '15:00',
                    checkbox: {advertising: 'false', search: 'true'}
                }, {
                    id: "4",
                    title: 'Datos del posteo numero 4',
                    street: 'Asuncion',
                    street_number: '2542',
                    postal_code: '1023',
                    description: 'Estos es una descripcion del posteo que se publico',
                    date: '25/11/22',
                    time: '19:30',
                    checkbox: {advertising: 'true', search: 'false'}
                }
            ],
            friends_list: [{id: "1", name: 'Amigo Numero 1'}, {id: "2", name: 'Amigo Numero 2'}, {id: "3", name: 'Amigo Numero 3'}, {id: "4", name: 'Amigo Numero 4'}],
            image: 'urlimage.com'
        }

        let userPostEdited;

        if(payload.id != undefined || payload.id != null){
            //Busco y encuentro el posteo exacto a editar
            const originalPost = userDataFromMongo.post_list.find( element => element.id === payload.id );
            //creo un objeto nuevo con los datos del posteo + id original
            const postEdited = {
                id: originalPost.id,
                title: payload.title,
                street: payload.street,
                street_number: payload.street_number,
                postal_code: payload.postal_code,
                description: payload.description,
                date: payload.date,
                time: payload.time,
                checkbox: payload.checkbox
            }
            //mando a guardar a actualizar el documento en mongo
            console.log('Posteo editado con exito: ' + JSON.stringify(postEdited));
            userPostEdited = {
                was_edited: true,
                user_post_edited: {
                    data: postEdited
                }
            }
        } else {
            userPostEdited = {
                was_edited: false,
                user_post_edited: {}
            }
        }
        return userPostEdited;
    }

    async deleteUserFriend(token, payload){
        //1.obtengo el token y mando a desencriptarlo para obtener el id del usuario en mongo
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        //3.Dentro del payload esta esta el Id del usuario que quiero eliminar de la lista de friends
        //4.Dentro de los datos que obtuve del usuario busco en la lista de friends un elemento
        //que coincida su element.id con el id del payload y lo quito de la lista
        //5.devuelvo los datos del usuario con la nueva lista
     
        //Mock of user data from mongo
        const userDataFromMongo = {
            name: 'Pipo',
            surname: 'Gorosito',
            social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
            description: 'Esto es una description de Pipo Gorosito',
            post_list: [{id: "1", title: 'Datos del posteo numero 1'}, {id: "2", title: 'Datos del posteo numero 2'}, {id: "3", title: 'Datos del posteo numero 3'}, {id: "4", title: 'Datos del posteo numero 4'}],
            friends_list: [{id: "1", name: 'Amigo Numero 1'}, {id: "2", name: 'Amigo Numero 2'}, {id: "3", name: 'Amigo Numero 3'}, {id: "4", name: 'Amigo Numero 4'}],
            image: 'urlimage.com'
        }

        let userDataEdited;

        if(payload.id != undefined || payload.id != null){
            console.log('lista antes de eliminar un elemento: ' + JSON.stringify(userDataFromMongo.friends_list));
            const newFriendsList = userDataFromMongo.friends_list.filter(item => item.id != payload.id);
            console.log('lista despues de eliminar un elemento: ' + JSON.stringify(newFriendsList));
            userDataFromMongo.friends_list = newFriendsList;
            userDataEdited = {
                was_deleted_friend: true,
                user_data_edited: {userDataFromMongo}
            }
        }else {
            userDataEdited = {
                was_deleted_friend: false,
                user_data_edited: {}
            }
        }
        return userDataEdited;
    }

    async deleteUserPost(token, payload){
        //1.obtengo el token y mando a desencriptarlo para obtener el id del usuario en mongo
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        //3.Dentro del payload esta esta el Id del post del usuario que quiero eliminar de la lista de posts
        //4.Dentro de los datos que obtuve del usuario busco en la lista de posts un elemento
        //que coincida su element.id con el id del payload y lo quito de la lista
        //5.devuelvo los datos del usuario con la nueva lista
     
        //Mock of user data from mongo
        const userDataFromMongo = {
            name: 'Pipo',
            surname: 'Gorosito',
            social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
            description: 'Esto es una description de Pipo Gorosito',
            post_list: [{id: "1", title: 'Datos del posteo numero 1'}, {id: "2", title: 'Datos del posteo numero 2'}, {id: "3", title: 'Datos del posteo numero 3'}, {id: "4", title: 'Datos del posteo numero 4'}],
            friends_list: [{id: "1", name: 'Amigo Numero 1'}, {id: "2", name: 'Amigo Numero 2'}, {id: "3", name: 'Amigo Numero 3'}, {id: "4", name: 'Amigo Numero 4'}],
            image: 'urlimage.com'
        }

        let userDataEdited;

        if(payload.id != undefined || payload.id != null){
            console.log('lista antes de eliminar un elemento: ' + JSON.stringify(userDataFromMongo.post_list));
            const newPostList = userDataFromMongo.post_list.filter(item => item.id != payload.id);
            console.log('lista despues de eliminar un elemento: ' + JSON.stringify(newPostList));
            userDataFromMongo.post_list = newPostList;
            userDataEdited = {
                was_deleted_post: true,
                user_data_edited: {userDataFromMongo}
            }
        }else {
            userDataEdited = {
                was_deleted_post: false,
                user_data_edited: {}
            }
        }
        return userDataEdited;
    }

    async postFollowUser(token, payload){
        //1.obtengo el token y mando a desencriptarlo para obtener el id del usuario en mongo
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        //3.El Payload trae el id del usuario que quiero agregar a mi lista de amigos
        //4.Con ese ID del payload traigo los datos del usuario que quiero seguir
        //5.Agrego un nuevo objeto a mi lista de amigos con esos datos del usuario que obtuve

        //con el token traigo mis datos
        //Mock of user data from mongo
        const userDataFromMongo = {
            name: 'Pipo',
            surname: 'Gorosito',
            social_media: [{name: 'instagram', url: 'instagram.com'}, {name: 'youtube', url: 'youtube.com'}, {name: 'spotify', url: 'spotify.com'}],
            description: 'Esto es una description de Pipo Gorosito',
            post_list: [{id: "1", title: 'Datos del posteo numero 1'}, {id: "2", title: 'Datos del posteo numero 2'}, {id: "3", title: 'Datos del posteo numero 3'}, {id: "4", title: 'Datos del posteo numero 4'}],
            friends_list: [{id: "1", name: 'Amigo Numero 1'}, {id: "2", name: 'Amigo Numero 2'}, {id: "3", name: 'Amigo Numero 3'}, {id: "4", name: 'Amigo Numero 4'}],
            image: 'urlimage.com'
        }

        let userFollowed;
        console.log('payload: ' + JSON.stringify(payload.id))
        //const id = payload.id;
        if(payload.id != undefined && payload.id != null && payload.id != ""){
            //voy a buscar a mongo ese id y si existe traigo los datos: id que ya lo tenia, nombre, foto, 
            //mock user to follow
            let userMocked = {
                id: payload.id,
                name: "Fulano Sultano",
                image: "https://url.com"
            }
            userDataFromMongo.friends_list.push(userMocked);
            userFollowed = {
                was_new_friend_added: true,
                user_data: {userDataFromMongo}
            }
        }else{
            userFollowed = {
                was_new_friend_added: false,
                user_data: {}
            }
        }
        return userFollowed;
    }
}

module.exports = ProfileService;