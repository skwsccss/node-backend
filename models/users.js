var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    userID: String,
    username: String,
    password: String,
    amount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    }
}, {
        timestamps: {
            createdAt: 'created_at'
        }
    });

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.generateToken = function () {
    return bcrypt.hashSync(Date.now, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);