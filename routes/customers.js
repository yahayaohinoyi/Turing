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
    } 
    // var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    //   mySqlCall((users)=>{
    //     console.log('payload received', jwt_payload);
    //     // usually this would be a database call:

    //     //  var user = users[_.findIndex(users, {customer_id: jwt_payload.id})];
    //     var user = null
    //     for(let i=0;i<users.length;i++){
    //         if(users[i].customer_id == jwt_payload.id)
    //         user = users[i]
    //     }
       
    //     if (user) {
    //       next(null, user);
    //     } else {
    //       next(null, false);
    //     }
    //   })
     
    // });

    // passport.use('jwt',strategy);
    app.post("/login", (req, res)=> {
      if(req.body.name && req.body.password){
        var name = req.body.name;
        var password = req.body.password;
      }
      // usually this would be a database call:
      mySqlCall((users)=>{
        var user = null
        for(let i=0;i<users.length;i++){
            if(name == users[i].name)
            user = users[i]
        }
        if( ! user ){
          res.json({message:"no such user found"});
        }
      
        if(user.password === password) {
          // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
          var payload = {id: user.customer_id};
          console.log(payload)
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          res.json({message: "ok", token: token});
        } else {
          res.status(401).json({message:"passwords did not match"});
        }
      })
     
    });

    // app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
    //   res.json("Success! You can not see this without a token");
    // });
}