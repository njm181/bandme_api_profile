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

            userProfileDb.updateOne({description: description, profile_photo: profile_photo, social_media: social_media}, function(error, result) {
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
        let userPostEdited = {
            was_edited: false,
            user_post_edited: {}
        }
       try{
        console.log("uid para buscar usuario: "+ userUid);
        const userProfileDb = await User.findById(userUid);
        console.log('datos obtenidos de la db del usuario: '+userProfileDb);
        const { email, user_type, description, profile_photo, social_media, first_name, last_name, account_status, post_list } = userProfileDb;
        //3.Del Payload puedo obtener el id de posteo que se quiere editar,
        //4.Entonces recorro la lista de posteos historicos y comparo los ID con el ID que viene en Payload
        let isValidPost = false;
        post_list.forEach((element, index) => {
            console.log("Elemento del for each: " + element);
            if(element == payload.id){
                console.log("Hay coincidencia lista de poste: " + element + "// id del posteo que viene del request: " + payload.id);
                isValidPost = true;
            }else{
                isValidPost = false;
            }
        });
        //5.Si encuentro coincidencia voy a la base a buscar ese posteo
        console.log("hay coincidencia? :" + isValidPost);
        if(isValidPost){
            try{
                const userPostDb = await Post.findById(payload.id);    
                console.log('datos obtenidos de la db del POSTEO: '+userPostDb);
                //6.Datos del posteo: Title, street, street number, postal code, description, date, time, checkbox
                //7.Comparo los campos contra los valores que trae Payload y aquellos que son distintos son pisados por los que trae Payload
                const postEdited = {
                    title: (userPostDb.title == payload.title || payload.title == '') ? userPostDb.title : payload.title,
                    street: (userPostDb.street == payload.street || payload.street == '') ? userPostDb.street : payload.street,
                    street_number: (userPostDb.street_number == payload.street_number || payload.street_number == '') ? userPostDb.street_number : payload.street_number,
                    postal_code: (userPostDb.postal_code == payload.postal_code || payload.postal_code == '') ? userPostDb.postal_code : payload.postal_code,
                    description: (userPostDb.description == payload.description || payload.description == '') ? userPostDb.description : payload.description,
                    date: (userPostDb.date == payload.date || payload.date == '') ? userPostDb.date : payload.date,
                    time: (userPostDb.time == payload.time || payload.time == '') ? userPostDb.time : payload.time,
                    checkbox: (userPostDb.checkbox == payload.checkbox || payload.checkbox == '') ? userPostDb.checkbox : payload.checkbox,
                }
                console.log('resultado del post editado: ' + JSON.stringify(postEdited));
                
                userPostDb.updateOne({
                    title: postEdited.title,
                    street: postEdited.street,
                    street_number: postEdited.street_number,
                    postal_code: postEdited.postal_code,
                    description: postEdited.description,
                    date: postEdited.date,
                    time: postEdited.time,
                    checkbox: postEdited.checkbox }, function(error, result) {
                    if(error){
                        console.log("Error al actualizar posteo del usuario en DB: " + error);
                    }else{
                        console.log("Posteo actualizado en DB: " + JSON.stringify(result));
                    }
                });

                userPostEdited = {
                    was_edited: true,
                    user_post_edited: {
                        data: postEdited
                    }
                }
            }catch(error){
                console.log('Error al buscar posteo en la base de datos: '+error);
                userPostEdited = {
                    was_edited: false,
                    user_post_edited: {}
                }
            }
        }else{
            console.log('el posteo no es valido: ' + isValidPost);
        }
        
       }catch(error){
        console.log("Error del catch: " + error);
        return false;
       }
        return userPostEdited;
    }

    async deleteUserFriend(userUid, payload){
        let userDataEdited = {
            was_deleted_friend: false,
            user_data_edited: {}
        };
        try{
            //2.con ese id de usuario de mongo obtengo los datos del usuario
            console.log("uid para buscar usuario: "+ userUid);
            const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);
            //3.Dentro del payload esta esta el Id del usuario que quiero eliminar de la lista de friends
            //4.Dentro de los datos que obtuve del usuario busco en la lista de friends un elemento
            //que coincida su element.id con el id del payload y lo quito de la lista
            //console.log('lista de amigos previo al filter: '+JSON.stringify(userProfileDb.friend_list));
            const list_edited = userProfileDb.friend_list.filter(element => 
                element._id != payload.id
            );
            //console.log("lista editada: " + JSON.stringify(list_edited));
            userProfileDb.friend_list = list_edited;
            //console.log("lista de amigos despues del filter: " + JSON.stringify(userProfileDb.friend_list));
            const result = await userProfileDb.save();//updateOne({post_list: userProfileDb.post_list});
            console.log("RESULT: " + result);    
            //que coincida su element.id con el id del payload y lo quito de la lista y actualizo el documento en mongo
            userDataEdited = {
                was_deleted_friend: true,
                user_data_edited: {result}
            }
            //5.devuelvo los datos del usuario con la nueva lista
        }catch(error){
            console.log("Error al obtener datos del usuario: " + error);
            userDataEdited = {
                was_deleted_friend: false,
                user_data_edited: {}
            };
        }
        return userDataEdited;
    }

    async deleteUserPost(userUid, payload){
        //2.con ese id de usuario de mongo obtengo los datos del usuario
        let userDataEdited = {
            was_deleted_post: false,
            user_data_edited: {}
        };
        try{
            console.log("uid para buscar usuario: "+ userUid);
            const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);
            //3.Dentro del payload esta esta el Id del post del usuario que quiero eliminar de la lista de posts
            //4.Dentro de los datos que obtuve del usuario busco en la lista de posts un elemento
            //let isValidPost = false;
            console.log('lista de posteos previo al filter: '+userProfileDb.post_list);
            const list_edited = userProfileDb.post_list.filter(element => 
                element != payload.id
            );
            userProfileDb.post_list = list_edited;
            const result = await userProfileDb.save();//updateOne({post_list: userProfileDb.post_list});
            console.log("RESULT: " + result);    
            //que coincida su element.id con el id del payload y lo quito de la lista y actualizo el documento en mongo
            userDataEdited = {
                was_deleted_post: true,
                user_data_edited: {result}
            }
        }catch(error){
            console.log("Error al obtener los datos del usuario: " + error);
            userDataEdited = {
                was_deleted_post: false,
                user_data_edited: {}
            }
        }
        return userDataEdited;
    }

    async postFollowUser(userUid, payload){
        //este id que trae el payload lo obtengo en la app entrando desde el dashboard donde veo los eventos ingreso al perfil del usuario que genero ese evento
        let userFollowed = {
            was_new_friend_added: false,
            user_data: {}
        };
        try{
            //2.con ese id de usuario de mongo obtengo los datos del usuario
            const userProfileDb = await User.findById(userUid);
            console.log('datos obtenidos de la db del usuario: '+userProfileDb);    
            //3.El Payload trae el id del usuario que quiero agregar a mi lista de amigos
            //4.Con ese ID del payload traigo los datos del usuario que quiero seguir
            const friendProfileDb = await User.findById(payload.id);
            console.log('datos obtenidos del amigo para agregar de la db: '+friendProfileDb);
            //5.Agrego un nuevo objeto a mi lista de amigos con esos datos del usuario que obtuve, pero solo id, nombre, apellido, y foto por el momento
            //const { email, user_type, description, profile_photo, social_media, first_name, last_name, account_status, post_list } = userProfileDb;
            //const { friend_list } = userProfileDb;
            const { _id, first_name, last_name, profile_photo } = friendProfileDb;
            const friend = {
                _id,
                first_name,
                last_name,
                profile_photo
            };
            console.log("datos del amigo: " + JSON.stringify(friend));
            console.log("friend list antes de agregar nuevo amigo: " + JSON.stringify(userProfileDb.friend_list));
            //userProfileDb.friend_list = friend_list;
            userProfileDb.friend_list.push(friend);
            console.log("friend list despues de agregar nuevo amigo: " + JSON.stringify(userProfileDb.friend_list));
            const result = await userProfileDb.save();
            userFollowed = {
                was_new_friend_added: true,
                user_data: {result}
            }
        }catch(error){
            console.log("Error al obtener datos del usuario: " + error);
            userFollowed = {
                was_new_friend_added: false,
                user_data: {}
            }
        }
        return userFollowed;
    }
}

module.exports = ProfileService;