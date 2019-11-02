
module.exports=function(app,conn){
app.get('/categories',function(req,res){
    

        conn.query('select * from TuringDB.category', function (err, recordset){
            if(err) console.log(err);
            res.send(recordset)
        
    })
})
app.get('/categories/:category_id',function(req,res){
  
        conn.query('select * from TuringDB.category', function (err, recordset){
            if(err) console.log(err);
            for (let i=0 ; i< recordset.length ;i++){
                if(recordset[i].category_id == req.params.category_id){
                    res.send(recordset[i])
                }
            }
        })
    
})

app.get('/categories/inProduct/:product_id',function(req,res){ //Just a little bug
    
    conn.query('select * from TuringDB.category',function(err,recordset){
        if(err) console.log(err);
        for(let i=0;i<recordset.length;i++){
            if(recordset[i].product_id == req.params.product_id){
            delete recordset[i].description
            
        }
        }
        res.send(recordset[i])
    })
})

app.get('/categories/inDepartment/:department_id',function(req,res){ //GET ALL CATEGORIES IN A DEPARTMENT
   
    
    conn.query('select * from TuringDB.category',function(err,recordset){
        var arr =[]
        if(err) console.log(err);
        for(let i=0;i<recordset.length;i++){
            if(recordset[i].department_id == req.params.department_id){
                arr.push(recordset[i])
                
            }
        }
        res.send(arr)
    })
   
})
}

