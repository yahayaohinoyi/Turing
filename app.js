var express = require('express');
var app = express();
require('./routes/departments')(app)
require('./routes/categories')(app)
app.listen(5000,function(){
    console.log('server running')
})