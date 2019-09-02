var sql = require("mysql");
// config for your database
var conn = sql.createConnection({
    user: 'root',
    password: 'dangermouse',
    server: 'localhost', 
    database: 'TuringDB' ,
    port:3306
})

module.exports = function(app){
app.get('/department', function (req, res) {
   
    // connect to your database
    conn.connect(function (err) {
    
        if (err) console.log(err);
        
        // query to the database and get the records
        conn.query('select * from TuringDB.department', function (err, recordset) {
            
            if (err) console.log(err)
            // send records as a response
            res.send(recordset);  
        });
        
    });
});

app.get('/department/:department_id',function(req,res){
   
   
   conn.connect(function (err) {
    
    if (err) console.log(err);
    
    // query to the database and get the records
    conn.query('select * from TuringDB.department', function (err, recordset) {
        
        if (err) console.log(err)
        
        for(let i=0 ; i< recordset.length ;i++){
            if(recordset[i].department_id == req.params.department_id){
                res.send(recordset[i])
            }
        }
    });
})
})}

