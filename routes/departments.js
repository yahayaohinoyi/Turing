module.exports = function(app,conn){
app.get('/department', function (req, res) {
        
        // query to the database and get the records
        conn.query('SELECT * FROM TuringDB.department', function (err, recordset) {
            
            if (err) console.log(err)
            // send records as a response
            res.send(recordset);  
        });
        
   
});


app.get('/department/:department_id',function(req,res){
    // query to the database and get the records
    conn.query('select * from TuringDB.department where department_id =' + req.params.department_id, function (err, recordset) {
        if (err) console.log(err)
        res.send(recordset[i])
    });

})

}

