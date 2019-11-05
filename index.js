var express = require('express');
var app = express();
var sql = require("mysql");
var bodyParser = require('body-parser')
var passport = require('passport')
var passport_jwt = require('passport-jwt')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var local_strategy = require('passport-local')
var sequelize = require('sequelize')
app.use(bodyParser.json())
// config for your database
var conn = sql.createConnection({
    user: 'root',
    password: 'dangermouse',
    server: 'localhost', 
    database: 'TuringDB' ,
    port:3306
})
 
require('./routes/departments')(app,conn)
require('./routes/categories')(app,conn)
require('./routes/attributes')(app,conn)
require('./routes/products')(app,conn)
require('./routes/customers')(app,conn,jwt,passport_jwt,passport,bcrypt,local_strategy,sequelize)
require('./routes/orders')(app,conn)
require('./routes/shoppingcart')(app,conn)
require('./routes/tax')(app,conn)
require('./routes/shipping')(app,conn)
app.listen(5000,()=>{
    console.log('server running')
})
