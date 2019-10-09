module.exports = (app,conn) =>{
    app.post('/customer',(req,res) => {
        conn.connect((err)=>{
            if(err) console.log(err)
            var sql = "insert into TuringDB.customer(TuringDB.customer.name , TuringDB.customer.email , TuringDB.customer.password) values ?";
            values = [
                [req.body.name , req.body.email , req.body.password]
            ]
            conn.query(sql,[values],(err,recordset)=>{
                if(err) console.log(err)
                res.send(recordset)
            })
        })
    
    })
}