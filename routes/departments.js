module.exports = function(app,conn){
app.get('/department', function (req, res) {
        try{
        conn.query('SELECT * FROM TuringDB.department', function (err, recordset) {
            res.send(recordset);  
        });}catch(err){
            res.send(err)
        }
});
app.get('/department/:department_id',function(req,res){
    try{
    conn.query('select * from TuringDB.department where department_id =' + req.params.department_id, function (err, recordset) {
        res.send(recordset)
    });}catch(err){
        res.send(err)
    }

})

}

