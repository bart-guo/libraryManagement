//借阅管理接口
const express = require('express')
const Record = require('../model/record')
const Book = require('../model/book')
const router = express.Router()
//借阅按钮接口
router.post('/borrow', (req, res) => {
    let {author, bookId, description, name, price, userId} = req.body
    findBook(bookId).then(doc => {
        // res.json(doc)
        return addRecord(doc, userId)
    }).then(doc => {
        // res.json(doc)
        return remove(bookId)
    }).then(
        res.json({success: true})
    ).catch(reason => {
        console.error(reason)
        res.json({success: false})
    })

    // res.json({author,bookId,description,name,price,userId})
})

//分页查询接口
router.post('/page', (req, res) => {
    let {name, page, size, userId} = req.body
    let nameRegx = eval(`/^(\\s|\\S)*${name}(\\s|\\S)*$/`)

    let result = {
        success: false,
        data: [],
        total: 0
    }
    findRecord(nameRegx, userId, page, size).then(docs=>{
        result.data = docs
        return count(nameRegx, userId)
    }).then(count=> {
        result.total = count
        result.success = true
        res.json(result)
    }).catch(reason => {
        console.error(reason)
        res.json(reason)
    })

})

//归还按钮接口
router.post('/return',(req,res)=>{
    let {id} = req.body
    Record.findOne({_id:id},(err,doc)=>{
        if (err) {
            console.error(err)
            res.json({success:false})
        }else {
            let now = Date.now()
            let book = new Book({
                    author:doc.author,
                    name:doc.name,
                    description:doc.description,
                    price:doc.price,
                    createTime:now,
                    updateTime:now
                })
            book.save().then(doc=>{
                Record.deleteOne({_id:id},(err)=>{
                    if (err){
                        console.error(err)
                        res.json({success:false})
                    }else res.json({success:true})
                })
            }).catch(reason => {
                console.error(reason)
                res.json({success:false})
            })
        }

    })
})





//总数查询封装
function count(name, userId) {
    return new Promise((resolve, reject) => {
        let refer = {name: {$regex:name}}
        if (userId) {
            refer.userId = userId
        }
        Record.count(refer,(err,_count)=>{
            if (err) reject(err)
            else resolve(_count)
        })
    })
}


//借阅查找封装
function findRecord(name, userId, page, size) {
    return new Promise((resolve, reject) => {
        let refer = {name: {$regex:name}}
        if (userId) {
            refer.userId = userId
        }
        Record.find(refer, null, {
            sort: {updateTime: -1},
            skip: (page - 1) * size,
            limit: size
        }, (err, docs) => {
            if (err) reject(err)
            else resolve(docs)
        })
    })
}
//图书查找封装
function findBook(bookId) {
    return new Promise((resolve, reject) => {
        Book.findOne({_id: bookId}, (err, doc) => {
            if (err) reject(err)
            else resolve(doc)
        })
    })
}

//图书删除封装
function remove(bookId) {
    return new Promise((resolve, reject) => {
        Book.deleteOne({_id: bookId}, reason => {
            if (reason) reject(reason)
            else resolve()
        })
    })
}
//借阅表记录添加封装
function addRecord(doc, userId) {
    return new Promise((resolve, reject) => {
        let now = Date.now()
        let record = new Record({
            author: doc.author,
            description: doc.description,
            price: doc.price,
            name: doc.name,
            userId: userId,
            expires: now + 1000 * 60 * 60 * 24 * 30,
            createTime: now,
            updateTime: now
        })
        record.save().then(doc => {
            resolve(doc)
        }).catch(reason => {
            reject(reason)
        })
    })
}

module.exports = router