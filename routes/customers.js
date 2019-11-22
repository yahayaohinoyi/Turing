module.exports = (app,conn,jwt,passport_jwt,passport,bcrypt,local_strategy,sequelize) =>{
    var ExtractJwt = passport_jwt.ExtractJwt;
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('JWT');
    jwtOptions.secretOrKey = 'dangermouse';

    function query( sql) {
      return new Promise( ( resolve, reject ) => {
          conn.query( sql,( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
          } );
      } );
  }
    async function generateSalt(password){
      return new Promise((resolve , reject)=>{
          bcrypt.genSalt(10,(err,salt)=>{
              if(err){
                  reject(err)
              }
              else{
                  resolve({
                      salt:salt,
                      password:password
                  })
              }
          })
      })
  }
  async function genHash(salt , password){
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err){
                reject(err)
            }
            else{
                resolve({
                    hash:hash,
                    password:password,
                    salt:salt
                })
            }
        })
    })
}
async function reHash(initialHash , password){
  salt = initialHash.substr(0,30) ;
  return new Promise((resolve , reject)=>{
    bcrypt.hash(password , salt , (err,reHash)=>{
      if(err){
          reject(err)
        }
        else{
          resolve({
            reHash: reHash,
            initialHash:initialHash,
            password:password

          })
        }
    })
    
  })
}
  
    
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
  app.post('/customer' , (req,res)=>{
    generateSalt(req.body.password)
      .then((result)=>{
          return genHash(result.salt , result.password)
      }).then((result)=>{
         console.log(result)
            var sql_query = 'insert into TuringDB.customer (name , email ,password) values ?';
            values = [[
              req.body.name , req.body.email , result.hash
            ]]
              query(sql_query,[values])
            }).catch((err)=>{
              res.send(err)
            })
    try{
        conn.query('select * from customer where email = '+ req.body.email ,(err,recordset)=>{
        jwt.sign({recordset},jwtOptions.secretOrKey,(err,token)=>{
          res.send({message:'user created'},{user,
          token,
       
        })
        })
      })
    }catch(err){
      res.send(err)
    };
  })
  app.post('/customer/login' , (req,res)=>{
      try{
      var sql = `select * from TuringDB.customer where email = '${req.body.email}'`;
        query(sql)
         .then(async (recordset)=>{
            try {
             const result = await reHash(recordset[0].password, req.body.password);
             console.log(result)
             if (req.body.email == recordset[0].email && result.reHash == result.initialHash) {
               jwt.sign({ recordset }, jwtOptions.secretOrKey, (err, token) => {
                 res.status(200).json({ 'message': 'user logged in', 'recordset': recordset, 'token': token });
               });
             }
             else {
               res.send({ "message": "user not in db" });
             }
           }
           catch (err) {
             res.send(err);
           }
            }).catch((err)=>{
               res.send(err)
            })
  
  }catch(err){
      res.send(err)
  }
  });
  //stuff
  app.get('/customer/:id' , (req,res)=>{
    try{
    var sql_query = 'select * from TuringDB.customer where TuringDB.customer.customer_id = '+ req.params.id;
    conn.query(sql_query , (err,recordset)=>{
      res.send(recordset)
    })
  }catch(err){
    res.send(err)
  }
  });
  app.put('/customer',passToken, (req,res) => { 
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, decoded) => {
      if(err) console.log(err)      
      var sql_query = "UPDATE customer SET email='"+req.body.email+"', name='"+req.body.name+"', day_phone='"+req.body.day_phone+"', eve_phone='"+req.body.eve_phone+"', mob_phone='"+req.body.mob_phone+"' WHERE email='"+decoded.recordset[0].email+"';"
      try{
      conn.query(sql_query ,(err) => {
        if(err){ 
          res.send(err) 
        } else{
          res.send( {'message':"updated successfully"} )}
      })   
      }catch(err){
        res.send(err)
      }
    });
  });
  app.put('/customer/address',passToken, (req,res)=>{ 
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, decoded)=> {
      var sql_query = `update TuringDB.customer set address_1 = '${req.body.address_1}',address_2 = '${req.body.address_2}',city = '${req.body.city}',region = '${req.body.region}',postal_code = '${req.body.postal_code}',shipping_region_id = '${req.body.shipping_region_id}'  where customer_id = '${decoded.recordset[0].customer_id}'`;
      try{
      conn.query(sql_query ,(err,recordset)=>{
        if(err){ res.send(err)}
        else{res.status(200).json({recordset})}
      })
    }catch(err){
      res.send(err)
    }
    });
  });
  app.put('/customer/creditCard',passToken, (req,res)=>{ 
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, decoded)=> {
      var sql_query = `update TuringDB.customer set credit_card = '${req.body.credit_card}' where customer_id = '${decoded.recordset[0].customer_id}'`;
      try{
      conn.query(sql_query ,(err)=>{
        if(err){ res.send(err)}
        else{res.send({'message':" credit card updated successfully"})}
      })
      }catch(err){
        res.send(err)
      }
    });
  });

}