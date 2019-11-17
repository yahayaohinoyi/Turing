module.exports=function(app,conn){
app.get('/categories',function(req,res){
        try{
        conn.query('select * from TuringDB.category', function (err, recordset){
            res.send(recordset)
        })}catch(err){
            res.send(err)
        }
})
app.get('/categories/:category_id',function(req,res){
        try{
        conn.query('select * from TuringDB.category where category_id = ' + req.params.category_id, function (err, recordset){
            
            res.send(recordset)  
        })
           }catch(err){
               res.send(err)
           }
})
app.get('/categories/inProduct/:product_id',function(req,res){   
    try{
    conn.query('select * from TuringDB.product_category where product_id ='+ req.params.product_id,function(err,recordset){
        conn.query('select * from category where category_id ='+recordset[0].category_id, (err,result)=>{
            res.send(result)
        })
    })}catch(err){
        res.send(err)

    }
})

app.get('/categories/inDepartment/:department_id',function(req,res){ 
    try{
    conn.query('select * from TuringDB.category where department_id = '+req.params.department_id,function(err,recordset){
       res.send(recordset)
    })}catch(err){
       res.send(err)
    }
   
})
}

