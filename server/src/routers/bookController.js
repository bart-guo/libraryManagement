//图书管理相关接口
const express = require('express')
const Book = require('../model/book')
const router = express.Router()

//分页查询接口
router.post('/page', (req, res) => {
    let {author, name, page, size} = req.body
    let authorReg = eval(`/^(\\s|\\S)*${author}(\\s|\\S)*$/`)
    let nameReg = eval(`/^(\\s|\\S)*${name}(\\s|\\S)*$/`)
    let result = {
        success: false,
        data: [],
        total: 0
    }
    find(authorReg, nameReg, page, size).then(docs => {
        result.data = docs
        return count(authorReg, nameReg)
    }).then(_count => {
        result.total = _count
        result.success = true
        res.json(result)
    }).catch(reason => {
        console.error(reason)
        res.json(result)
    })
    // res.json({author, name, page, size})
})

//图书添加接口
router.post('/add', (req, res) => {
    let {author, name, description, price} = req.body
    let now = Date.now()
    let book = new Book({author, name, description, price, createTime: now, updateTime: now})
    book.save().then(doc => {
        res.json({success: true})
    }).catch(season => {
        console.error(season)
        res.json({success: false})
    })
    // res.json({author,name,description,price})
})

//图书删除接口
router.post('/remove', (req, res) => {
    let {ids} = req.body
    Book.deleteMany({
        _id: {$in: ids}
    }, err => {
        if (err) {
            console.error(err)
            res.json({success: false})
        } else res.json({success: true})
    })
})

//图书数据更改接口
router.post('/update', (req, res) => {
    let {author, description, name, price, id} = req.body
    Book.updateOne({
        _id: id
    }, {author, description, name, price, updateTime: Date.now()}, (err, doc) => {
        if (err) {
            console.error(err)
            res.json({success: false})
        } else res.json({success: true})
    })
})

//查询封装
function find(authorReg, nameReg, page, size) {
    return new Promise((resolve, reject) => {
        Book.find({author: {$regex: authorReg}, name: {$regex: nameReg}}, null, {
            sort: {updateTime: -1},
            skip: (page - 1) * size,
            limit: size
        }, (err, docs) => {
            if (err) reject(err)
            else resolve(docs)
        })
    })
}

//总数据查询封装
function count(authorReg, nameReg) {
    return new Promise((resolve, reject) => {
        Book.count({author: {$regex: authorReg}, name: {$regex: nameReg}}, (err, _count) => {
            if (err) reject(err)
            else resolve(_count)
        })
    })
}

module.exports = router