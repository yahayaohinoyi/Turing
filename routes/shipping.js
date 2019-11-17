module.exports = function(app,conn){
    app.get('/shipping/regions',(req,res)=>{
        let sql = 'select * from TuringDB.shipping_region';
        try{
        conn.query(sql , (err,recordset)=>{
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
    });
    app.get('/shipping/regions/:shipping_region_id',(req,res)=>{
        let sql = 'select * from TuringDB.shipping where shipping_region_id = '+ req.params.shipping_region_id;
        try{
        conn.query(sql , (err,recordset)=>{
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
    });
}