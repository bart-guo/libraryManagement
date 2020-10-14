const {model, Schema} = require('mongoose')
//借阅记录表
let schema = new Schema({
    author: {type: String, index: true},
    // bookId: {type: String, index: true, unique: true},
    description: {type: String, index: true},
    price:{type:Number,index:true},
    name: {type: String, index: true},
    userId: {type: String, index: true},
    expires: {type: String, index: true},//到期时间
    createTime: {type: Number, index: true},
    updateTime: {type: Number, index: true}
})


let Record = model('record', schema)

module.exports = Record