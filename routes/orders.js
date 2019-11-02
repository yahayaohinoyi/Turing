module.exports=(app,conn)=>{
  app.post('/orders',(req,res)=>{
     
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var sql_count = 'select count(*) as count from TuringDB.orders';
      var sql_query = 'insert into TuringDB.orders (shipping_id , tax_id ,created_on) values ?';
      values = [[
          req.body.shipping_id , req.body.tax_id , date
      ]]      
      conn.query(sql_query,[values],(err)=>{
          if(err) console.log(err)
      })
      conn.query(sql_count,(err,recordset)=>{
          if(err) console.log(err)
          res.send({'order_id' : recordset[0].count})

      })
  });
 
  app.get('/orders/:unknown' , (req , res)=>{ //mad oo to be fixed
      if(req.params.unknown == "inCustomer"){
        var sql = 'select TuringDB.orders.order_id,TuringDB.orders.total_amount,TuringDB.orders.created_on,TuringDB.orders.shipped_on,TuringDB.customer.name from TuringDB.orders,TuringDB.customer'

        conn.query(sql,(err,recordset)=>{
          if(err) console.log(err)
          res.send(recordset)
        })
      }else{
        var sql = 'select * from TuringDB.order_detail';
        conn.query(sql ,(err , recordset)=>{
          if(recordset.length == 0){
            res.send('Database Empty')
          }
          else{
          if(err) console.log(err)
            check = req.params.order_id;
          if(check > recordset.length){
              res.send('wrong input param')
          }
          else{
            for(let i=0 ; i<recordset.length ;i++){
                if(check == recordset[i].order_id){
                  res.send(recordset[i])
                  
                  break;
                }
                
            }
          }
        }
        })
      }
 
  })

  // app.get('/orders/:order_id',(req,res)=>{ //query to be edited
     

    
  // });

}
