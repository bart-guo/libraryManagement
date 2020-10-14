const {model, Schema} = require('mongoose')
//登录状态记录表
const schema = new Schema({
    userId: {type: String, index: true, unique: true},
    expires: {type: Number, index: true},
    createTime: {type: Number, index: true},
    updateTime: {type: Number, index: true}
})
const LoginToken = model('login-token', schema)

module.exports = LoginToken