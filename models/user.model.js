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
    userType: {
        type: String
    },
    provider: {
        type: String
    },
    profilePhoto: {
        type: String,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    accountStatus: {
        type: String,
        default: 'diseable'
    }
});

const User = model( 'User', UserSchema );

module.exports = User;