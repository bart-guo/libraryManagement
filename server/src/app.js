const  express= require('express')
const mongoose = require('mongoose')
//引入body-parser处理参数模块
const bodyParser = require('body-parser')
const app = express()
const port = 1024
//引入Controller
const userController = require('./routers/userController.js')
const bookController = require('./routers/bookController.js')
const recordController = require('./routers/recordController')

//建立与MongoDB数据库的连接
mongoose.connect('mongodb://localhost:27017/library',{useNewUrlParser:true})
let db = mongoose.connection
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',() => {
    console.log("数据库连接成功!")
})
//设置允许跨域访问服务
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    next();
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//安装自定义Controller路由器
app.use('/user',userController) //中间件有执行顺序要求
app.use('/book',bookController)
app.use('/record',recordController)


// let user = new User({
//     account:'hu',
//     pwd:'111111',
//     nickName:'TomAry',
//     createTime:new Date(),
//     updateTime:new Date()
// })
// user.save()


app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})