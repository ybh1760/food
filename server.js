var express = require('express')
var app = express()
var router = require('./router/main')(app)
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

var server = app.listen(3000, function () {
    console.log('Express server has started on port 3000')
})
