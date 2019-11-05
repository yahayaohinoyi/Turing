module.exports = function(app,conn){
    app.get('/shipping/regions',(req,res)=>{
        let sql = 'select * from TuringDB.shipping_region';
        conn.query(sql , (err,recordset)=>{
            if(err) console.log(err)
            res.send(recordset)
        })
    });
    app.get('/shipping/regions/:shipping_region_id',(req,res)=>{
        let sql = 'select * from TuringDB.shipping where shipping_region_id = '+ req.params.shipping_region_id;
        conn.query(sql , (err,recordset)=>{
            if(err) console.log(err)
            res.send(recordset)
        })
    });

}