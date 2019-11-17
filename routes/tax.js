module.exports = function(app,conn){
    app.get('/tax',(req ,res)=>{
        let sql = 'select * from TuringDB.tax';
        try{
        conn.query(sql , (err,recordset)=>{
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }

    });
    app.get('/tax/:tax_id',(req ,res)=>{
        let sql = 'select * from TuringDB.tax where tax_id =' + req.params.tax_id;
        try{
        conn.query(sql , (err,recordset)=>{
            res.send(recordset[0])
        })
        }catch(err){
            res.send(err)
        }

    });

}