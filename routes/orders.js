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
 
  app.get('/orders/:order_id' , (req , res)=>{ //mad oo to be fixed
    
      if(req.params.order_id == "inCustomer"){
        var sql = 'select TuringDB.orders.order_id,TuringDB.orders.total_amount,TuringDB.orders.created_on,TuringDB.orders.shipped_on,TuringDB.customer.name from TuringDB.orders,TuringDB.customer '

        conn.query(sql,(err,recordset)=>{
          if(err) console.log(err)
          res.send(recordset)
        })
      }else{
        conn.query('select * from TuringDB.orders where order_id ='+ req.params.order_id ,(err , recordset)=>{
          if(recordset.length == 0){
            res.send('Table Empty')
          }
         
          else{
            for(let i=0 ; i<recordset.length ;i++){
                if(req.params.order_id == recordset[i].order_id){
                  res.send(recordset[i])

                  break;
            }
          }
        }
        })
      }
  })

app.get('/orders/shortDetail/:order_id',(req,res)=>{
    var sql = 'select TuringDB.orders.order_id,TuringDB.orders.total_amount,TuringDB.orders.created_on,TuringDB.orders.shipped_on,TuringDB.customer.name from TuringDB.orders,TuringDB.customer where TuringDB.orders.order_id = '+req.params.order_id;
    conn.query(sql,(err,recordset)=>{
        if(err) console.log(err)
        res.send(recordset)
    })
})
}
