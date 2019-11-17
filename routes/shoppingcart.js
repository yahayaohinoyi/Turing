module.exports = function(app,conn,jwt){

    const secret = require('../config/strategy')

    const passToken =(req,res,next) => {
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== undefined){
          const bearer = bearerHeader.split(' ');
          const bearerToken = bearer[1]
          req.token = bearerToken;
          next();
        }else{
          res.sendStatus(403)
        }
       };
    app.get('/shoppingcart/generateUniqueId',(req,res)=>{
        var sql = 'select count(*) as count from TuringDB.shopping_cart';
        try{
        conn.query(sql,(err,recordset)=>{
             res.send({'cart_id' : recordset[0].count + 1})
        })
    }catch(err){
        res.send(err)
    }
    });
    app.post('/shoppingcart/add',(req,res)=>{ //change status
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var sql_query = 'insert into TuringDB.shopping_cart (cart_id , product_id ,attributes,quantity ,added_on) values ?';
        values = [[
            req.body.cart_id , req.body.product_id , req.body.attributes ,req.body.quantity , date
        ]]      
        conn.query(sql_query,[values],(err)=>{
            if(err) res.send(err)
        });
        try{
        conn.query('select * from TuringDB.shopping_cart',(err,recordset)=>{
            res.send(recordset)
        })
       }catch(err){
            res.send(err)
       }
    });
    app.get('/shoppingcart/:cart_id',(req,res)=>{
        let sql = 'select * from TuringDB.shopping_cart where cart_id ='+req.params.cart_id;
        try{
        conn.query(sql , (err,recordset)=>{
            res.send(recordset)
        })
        }catch(err){
            res.send(err)
        }
    });
    app.put('/shoppingcart/update/:item_id', passToken, (req, res)=>{ //requery
        jwt.verify(req.token,secret,(err,decoded)=>{
            if(err) res.send(err)
            try{
            conn.query('update TuringDB.shopping_cart set(quantity) = ? where item_id = ' + decoded.recordset[0].item_id,[req.body.quantity ] , (err,recordset)=>{
                 res.send({"message" : "quantity updated successfully"})
            })
            }catch(err){
                 res.send(err)
            }
        })
    });
    app.delete('/shoppingcart/empty/:cart_id',passToken,(req,res)=>{
        jwt.verify(req.token , secret, (err)=>{
            if(err) res.send(err)
            try{
            conn.query('delete from TuringDB.shopping_cart where cart_id ='+req.params.cart_id,(err,recordset)=>{
                if(err) console.log(err)
                res.status(200).send({recordset})
                
            })
            }catch(err){
                res.send(err)
            }
        })
        
    });
    app.delete('/shoppingcart/removeProduct/:item_id',passToken,(req,res)=>{
        jwt.verify(req.token , secret, (err)=>{
            if(err) res.send(err)
            try{
            conn.query('delete from TuringDB.shopping_cart where item_id ='+req.params.item_id,(err,recordset)=>{
                res.status(200).send({recordset})
                
            })
            }catch(err){
                res.send(err)
            }
        })
         
    });

}