    const { Schema, model, mongoose } = require('mongoose');

    const PostSchema = Schema({
        //_id: mongoose.SchemaTypes.ObjectId,
        id_owner: {
            type: String
        },
        title: {
            type: String
        },
        street: {
            type: String
        },
        street_number: {
            type: String
        },
        postal_code: {
            type: String
        },
        description: {
            type: String
        },
        date: {
            type: String
        },
        time: {
            type: String
        },
        checkbox: {
            type: Object
        },
    });

    const Post = model('Post', PostSchema);

    module.exports = Post;