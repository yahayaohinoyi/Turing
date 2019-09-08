
module.exports= function(app,conn){
app.get('/products',function(req,res){
    
     conn.connect(function(err){
         if (err) console.log(err);
         function offset(){
             var page = req.query.page;
             offset = (parseInt(page) - 1) * 20
             return offset
         };
         conn.query('select product_id,name,description,price,discounted_price,thumbnail from TuringDB.product LIMIT 20 OFFSET ' + offset(),function(err,recordset){
            if(err) console.log(err);
            var response ={}
            var totalRecords = recordset.length
            var page= 1;
            var limit= 20;
            var description_length = 200;
             if(req.query.page != null  || req.query.limit != null || req.query.description_length!= null){
              page= req.query.page;
              limit= req.query.limit;
              description_length = req.query.description_length;
             }; 
             
             response.paginationMeta = {
                 "currentPage": page,
                 "currentPageSize" : limit,
                 "totalPages" : parseInt( totalRecords/limit)? totalRecords%limit==0 :parseInt(totalRecords/limit) + 1 ,
                 "totalRecords " : totalRecords
             };
          
            response.rows = recordset;
            res.send(response)
         })
     })
     
})
app.get('/products/search',function(req,res){
    conn.connect(function(err){
        if(err) console.log(err)
        if(req.query.query_string != null || req.query.all_words !=null){
            var search_string = req.query.query_string;
            var all_words = req.query.all_words;
        }
        conn.query("select product_id,name,description,price,discounted_price,thumbnail from TuringDB.product WHERE name = '" +search_string + "' LIMIT 20",function(err,recordset){
            if(err) console.log(err)
            res.send(recordset)
        })
    })
})
}