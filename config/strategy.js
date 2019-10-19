module.exports = (app,conn,passport_jwt,passport) =>{
  
    function mySqlCall(callback){
        conn.connect((err)=>{
            if(err) console.log(err)
        })
            conn.query('select customer_id,name,password from TuringDB.customer',(err , recordset) =>{
                if(err) console.log(err)
                 users = recordset
                 return callback(recordset)
            })
    }

  
}