var express = require('express');
var app = express();
var sql = require("mysql");
var bodyParser = require('body-parser')

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
require('./routes/products')(app,conn,bodyParser)
app.listen(5000,function(){
    console.log('server running')
})
