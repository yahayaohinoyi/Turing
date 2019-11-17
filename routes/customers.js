module.exports = (app,conn,jwt,passport_jwt,passport,bcrypt,local_strategy,sequelize) =>{
    var ExtractJwt = passport_jwt.ExtractJwt;
    var JwtStrategy = passport_jwt.Strategy;
    var localStrategy = local_strategy.Strategy
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('JWT');
    jwtOptions.secretOrKey = 'dangermouse';
    const BCRYPT_SALT_ROUND = 12;

    mySqlCall = (callback) => {
          conn.query('select * from TuringDB.customer',(err , recordset) =>{
              if(err) console.log(err)
               return callback(recordset)
          })
    } ;
    
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
    var sql_query = 'insert into TuringDB.customer (name , email ,password) values ?';
    values = [[
      req.body.name , req.body.email , req.body.password
    ]]
    conn.query(sql_query,[values],(err)=>{
      if(err) console.log(err)
    })
    mySqlCall((users)=>{
      for(let i=0; i<users.length ; i++){
        if(users[i].email == req.body.email){
          user = users[i]
          break
        }
      }
      jwt.sign({user},jwtOptions.secretOrKey,(err,token)=>{
        if(err) console.log(err);
        res.send({message:'user created'},{user,
        token,
     
      })
      })
      
    })
  });
  app.post('/customer/login' , (req,res)=>{
      conn.query('select * from TuringDB.customer where email = ? and password = ?',[req.body.email ,req.body.password] ,(err,recordset)=>{ 
      if(err) console.log(err);
        jwt.sign({recordset},jwtOptions.secretOrKey,(err,token)=>{
          if(err) console.log(err);
          res.status(200).json({'message': 'user logged in' , 'recordset': recordset, 'token' : token})
        })
      
    })
  });
  //stuff
  app.get('/customer/:id' , (req,res)=>{
    var sql_query = 'select * from TuringDB.customer where TuringDB.customer.customer_id = '+ req.params.id;
    conn.query(sql_query , (err,recordset)=>{
      if(err) console.log(err);
      res.send(recordset)
    })
  });

  app.put('/customer',passToken, (req,res)=>{ // such cute code but an err in mysql syntax
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, decoded)=> {
      if(err) console.log(err)      
      var sql_query = 'update TuringDB.customer set(email , name ,day_phone ,eve_phone , mob_phone) = ? where email = ' + decoded.recordset[0].email;
      values = [req.body.email , req.body.name,req.body.day_phone , req.body.eve_phone ,req.body.mob_phone] ;
      conn.query(sql_query,[values],(err)=>{
        if(err){ res.send(err)}
        else{res.send({'message':"updated successfully"})}
      })
    });
  });
  app.put('/customer/address',passToken, (req,res)=>{ // such cute code but an err in mysql syntax
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, decoded)=> {
      if(err) console.log(err)      
      var sql_query = 'update TuringDB.customer set(address_1,address_2,city,region,postal_code,shipping_region_id) = ? where email = ' + decoded.recordset[0].email;
      values = [req.body.address_1 , req.body.address_2,req.body.city , req.body.region ,req.body.postal_code , req.body.shipping_region_id] ;
      conn.query(sql_query,[values],(err)=>{
        if(err){ res.send(err)}
        else{res.send({'message':"updated successfully"})}
      })
    });
  });
  app.put('/customer/creditCard',passToken, (req,res)=>{ // such cute code but an err in mysql syntax
    jwt.verify(req.token, jwtOptions.secretOrKey, (err, decoded)=> {
      if(err) console.log(err)      
      var sql_query = 'update TuringDB.customer set(credit_card) = ? where email = ' + decoded.recordset[0].email;
      values = [req.body.credit_card] ;
      conn.query(sql_query,[values],(err)=>{
        if(err){ res.send(err)}
        else{res.send({'message':"updated successfully"})}
      })
    });
  });

}