const {model, Schema} = require('mongoose')
//用户表
let schema = new Schema({
    account: {type: String, index: true, unique: true},
    pwd: {type: String, index: true},
    nickName: {type: String, index: true},
    createTime: {type: Number, index: true},
    updateTime: {type: Number, index: true}
})

const User = model('user', schema)

module.exports = User