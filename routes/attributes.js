module.exports = function(app,conn){
    app.get('/attributes',function(req,res){
        try{
        conn.query('select * from TuringDB.attribute',function(err,recordset){
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
    });

    app.get('/attributes/:attribute_id',function(req,res){
        try{
        conn.query('select * from TuringDB.attribute where attribute_id = '+ req.params.attribute_id,function(err,recordset){
           res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
    });

    app.get('/attributes/values/:attribute_id',function(req,res){
        try{  
        conn.query("select attribute_value_id,value from TuringDB.attribute_value where attribute_id = ? ",[req.params.attribute_id],function(err,recordset){
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
    });

    app.get('/attributes/inProduct/:product_id',(req,res)=>{
        conn.query("")

    })

}
// one  function left