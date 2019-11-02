
module.exports = function(app,conn){
    app.get('/attributes',function(req,res){
    
        conn.query('select * from TuringDB.attribute',function(err,recordset){
            if(err) console.log(err)
            res.send(recordset)
        })
    });

    app.get('/attributes/:attribute_id',function(req,res){
       
        conn.query('select * from TuringDB.attribute',function(err,recordset){
            if(err) console.log(err)
            for(let i=0;i<recordset.length ;i++){
                if(req.params.attribute_id == recordset[i].attribute_id){
                    res.send(recordset[i])
                }
            }
        })
    })

    app.get('/attributes/values/:attribute_id',function(req,res){
      
        conn.query("select attribute_value_id,value from TuringDB.attribute_value where attribute_id = ? ",[req.params.attribute_id],function(err,recordset){
            res.send(recordset)
        })
    })

}
// one  function left