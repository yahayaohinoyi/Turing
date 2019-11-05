module.exports = function(app,conn){
    app.get('/shoppingcart/generateUniqueId',(req,res)=>{
        var sql = 'select count(*) as count from TuringDB.shopping_cart';
        conn.query(sql,(err,recordset)=>{
            if(err) console.log(err)
             res.send({'cart_id' : recordset[0].count + 1})
        })
    });
    app.post('/shoppingcart/add',(req,res)=>{ //change status
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var sql_query = 'insert into TuringDB.shopping_cart (cart_id , product_id ,attributes,quantity ,added_on) values ?';
        values = [[
            req.body.cart_id , req.body.product_id , req.body.attributes ,req.body.quantity , date
        ]]      
        conn.query(sql_query,[values],(err)=>{
            if(err) console.log(err)
        });
        conn.query('select * from TuringDB.shopping_cart',(err,recordset)=>{
            if(err) console.log(err)
            res.send(recordset)
        })
    });
    app.get('/shoppingcart/:cart_id',(req,res)=>{//requery
        let sql = 'select * from TuringDB.shopping_cart where cart_id ='+req.params.cart_id;
        conn.query(sql , (err,recordset)=>{
            if(err) console.log(err)
            res.send(recordset)
        })
    });
    app.put('shoppingcart/update/:item_id' , (req, res)=>{

    });
    app.delete('shoppingcart/empty/:cart_id',(req,res)=>{

    });
    app.delete('shoppingcart/removeProduct/:item_id',(req,res)=>{
         
    });

}