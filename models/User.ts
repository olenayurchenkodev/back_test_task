let {Schema, model, Types} = require(`mongoose`)

const schema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: String},
    profileNum: {type: Number, default: 0}
})

module.exports = model('User', schema)

