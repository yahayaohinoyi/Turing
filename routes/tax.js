module.exports = function(app,conn){
    app.get('/tax',(req ,res)=>{
        let sql = 'select * from TuringDB.tax';
        conn.query(sql , (err,recordset)=>{
            if(err) console.log(err)
            res.send(recordset)
        })

    });
    app.get('/tax/:tax_id',(req ,res)=>{
        let sql = 'select * from TuringDB.tax where tax_id =' + req.params.tax_id;
        conn.query(sql , (err,recordset)=>{
            if(err) console.log(err)
            res.send(recordset[0])
        })

    });

}