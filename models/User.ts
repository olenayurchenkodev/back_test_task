let {Schema, model, Types} = require(`mongoose`)

// User schema
const user = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: String},
    profileNum: {type: Number, default: 0}
})

module.exports = model('User', user)

