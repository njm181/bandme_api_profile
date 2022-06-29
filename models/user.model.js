const { Schema, model, mongoose } = require('mongoose');

const UserSchema = Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String
    },
    user_type: {
        type: String
    },
    provider: {
        type: String
    },
    profile_photo: {
        type: String,
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    description: {
        type: String
    },
    social_media: {
        type: Array
    },
    account_status: {
        type: String,
        default: 'enable'
    }
});

const User = model( 'User', UserSchema );

module.exports = User;