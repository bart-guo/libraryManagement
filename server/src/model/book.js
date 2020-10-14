const {model,Schema} = require('mongoose')
//图书表
let schema = new Schema({
    author:{type:String,index:true},
    name:{type:String,index:true},
    description:{type:String,index:true},
    price:{type:Number,index:true},
    createTime:{type:Number,index:true},
    updateTime:{type:Number,index:true}
})
let Book = model('book',schema)

module.exports = Book