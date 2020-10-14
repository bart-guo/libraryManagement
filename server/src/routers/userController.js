//用户管理界面接口
const express = require('express')
const User = require('../model/user')
const LoginToken = require('../model/loginToken')
const router = express.Router()

//注册接口
router.post('/register', (req, res) => {
    // console.log(req)
    let {account, pwd, nickName} = req.body
    let now = Date.now()
    let user = new User({account, pwd, nickName, createTime: now, updateTime: now})
    user.save().then(doc => {
        res.json({success: true})
    }).catch(err => {
        console.error(err)
        res.json({success: false})
    })
    // res.end('register')
})
//登录接口
router.post('/login', (req, res) => {
    // console.log(req)
    let {account, pwd} = req.body
    User.findOne({account, pwd}, (err, doc) => {
        if (err) {
            console.error(err)
            res.json({success: false})
        } else {
            if (!doc) {
                res.json({success: false})
            } else {
                let now = Date.now()
                LoginToken.findOneAndUpdate({userId: doc._id}, {
                    expires: now + 7 * 24 * 60 * 60 * 1000,
                    updateTime: now
                }, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: {
                        userId: doc._id,
                        createTime: now
                    }
                }, ((_err, _doc) => {
                    if (_err) {
                        console.error(_err)
                        res.json({success: false})
                    } else {
                        res.json({
                            success: true,
                            userInfo: {
                                userId: doc._id,
                                expires: _doc.expires,
                                nickName: doc.nickName
                            }
                        })
                    }
                }))
            }
        }
    })
})

//分页查询接口
router.post('/page', (req, res) => {
    let {account, nickName, page, size} = req.body
    let accountReg = eval(`/^(\\s|\\S)*${account}(\\s|\\S)*$/`)
    let nickNameReg = eval(`/^(\\s|\\S)*${nickName}(\\s|\\S)*$/`)
    // User.find({
    //     account:{$regex:accountReg},
    //     nickName:{$regex: nickNameReg}
    // },null,{
    //     sort:{updateTime:-1},
    //     skip:(page-1)*size,
    //     limit:size
    // },(err,docs)=>{
    //     if(err){
    //         console.log(err)
    //         res.json({success:false})
    //     }else {
    //         res.json(docs)
    //     }
    // })
    // res.end('my page')
    let result = {
        success: false,
        data: [],
        total: 0
    }
    find(accountReg, nickNameReg, page, size).then(docs => {
        result.data = docs
        return count(accountReg, nickNameReg, page, size)
    }).then(count => {
        result.total = count
        result.success = true
        res.json(result)
    }).catch(reason => {
        console.error(reason)
        res.json(result)
    })
})


//删除接口
router.post('/remove', (req, res) => {
    let {ids} = req.body
    ids = ids ? ids : []
    User.deleteMany({
        _id: {$in: ids}
    }, err => {
        if (err) {
            console.error(err)
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    })
})

//用户昵称修改接口
router.post('/modifyNickName', (req, res) => {
    let {id, nickName} = req.body
    User.updateOne({
        _id: id
    }, {
        nickName,
        updateTime: Date.now()
    }, (err, raw) => {
        if (err) {
            console.error(err)
            res.json({success: false})
        } else {
            res.json({success: true})
        }
    })
})

//查询的Promise方法封装
function find(accountReg, nickNameReg, page, size) {
    return new Promise((resolve, reject) => {
        User.find({
            account: {$regex: accountReg},
            nickName: {$regex: nickNameReg}
        }, null, {
            sort: {updateTime: -1},
            skip: (page - 1) * size,
            limit: size
        }, (err, docs) => {
            if (err) {
                console.log(err)
                // res.json({success:false})
                reject(err)
            } else {
                // res.json(docs)
                resolve(docs)
            }
        })
    })
}


//总条数的Promise方法封装
function count(accountReg, nickNameReg, page, size) {
    return new Promise(((resolve, reject) => {
        User.count({
            account: {$regex: accountReg},
            nickName: {$regex: nickNameReg}
        }, (err, count) => {
            if (err) {
                reject(err)
            } else {
                resolve(count)
            }
        })
    }))
}

module.exports = router