const express = require('express')
const mongoose = require('mongoose');
const app = express()
let bodyParser = require('body-parser')
let favicon = require('serve-favicon')
const port = process.env.PORT || 3000



//Middlewares
app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(favicon(__dirname + '/public/img/favicon.ico'));

//Database connection
let uri = 'mongodb://pinebark:pine1234@cluster0-shard-00-00-dk3hb.mongodb.net:27017,cluster0-shard-00-01-dk3hb.mongodb.net:27017,cluster0-shard-00-02-dk3hb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Modules
const home = require('./routes/home')
const products = require('./routes/products')
const about = require('./routes/about')
const adminIndex = require('./routes/admin/index')
const adminCreate = require('./routes/admin/create')
const adminCreatePost = require('./routes/admin/createPost')
const adminUpdate = require('./routes/admin/update')
const adminUpdatePost = require('./routes/admin/updatePost')
const adminDelete = require('./routes/admin/delete')
const contact = require('./routes/contact')


app.get('/', home)
app.get('/products', products)
app.get('/about', about)
app.get('/admin', adminIndex)
app.get('/admin/create', adminCreate)
app.post('/admin/create', adminCreatePost)
app.get('/admin/update/:id', adminUpdate)
app.post('/admin/update', adminUpdatePost)
app.get('/admin/delete/:id', adminDelete)
app.get('/contact', contact)


app.listen(port, () => console.log(`Pine and Bark running on port ${port}!`))