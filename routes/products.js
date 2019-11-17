
module.exports= function(app,conn){
app.get('/products',function(req,res){
         function offset(){
             var page = req.query.page;
             offset = (parseInt(page) - 1) * 20
             return offset
         };
         try{
         conn.query('select product_id,name,description,price,discounted_price,thumbnail from TuringDB.product LIMIT 20 OFFSET ' + offset(),function(err,recordset){
          
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
        }catch(err){
            res.send(err)
        }
 
     
})
app.get('/products/search',function(req,res){ //finish up later
        if(req.query.query_string != null || req.query.all_words !=null){
            var search_string = req.query.query_string;
            var all_words = req.query.all_words;
        }
        conn.query("select product_id,name,description,price,discounted_price,thumbnail from TuringDB.product WHERE name = '" +search_string + "'",function(err,recordset){
            if(err) console.log(err)
            res.send(recordset)
        })
    
})
app.get('/products/:product_id',function(req,res){ //4.3
        try{
        conn.query('select * from TuringDB.product WHERE product_id = ' + req.params.product_id,function(err,recordset){
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
 
})

app.get('/products/inCategory/:category_id',function(req,res){ //some queries req 4.4
        try{
        conn.query('select TuringDB.product.product_id,TuringDB.product.name,TuringDB.product.description ,TuringDB.product.price,TuringDB.product.discounted_price,TuringDB.product.thumbnail from TuringDB.product,TuringDB.product_category where TuringDB.product.product_id = TuringDB.product_category.product_id and TuringDB.product_category.category_id = '+ req.params.category_id,function(err,recordset){

            res.send(recordset)
        
    })
       }catch(err){
           res.send(err)
      }
})

app.get('/products/:product_id/reviews', function(req,res){
        try{
        conn.query('select TuringDB.review.review,TuringDB.review.rating,TuringDB.review.created_on from TuringDB.review where TuringDB.review.product_id =' + req.params.product_id,function(err,recordset){
            res.send(recordset)
    })  }catch(err){
        res.send(err)
    }
})
app.post('/products/:product_id/reviews', function(req,res){
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
       var sql = "insert into TuringDB.review (review_id,customer_id,product_id,review,rating,created_on ) values ?";
       values = [
           req.body.review_id , req.body.customer_id ,req.body.product_id , req.body.review , req.body.rating , date
       ]
       try{
        conn.query(sql,[values],function(err,recordset){
           
               res.send(recordset)
        })
    }catch(err){
        res.send(err)
    }
})
}
