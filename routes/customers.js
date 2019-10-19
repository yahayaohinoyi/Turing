module.exports = (app,conn,jwt,passport_jwt,passport) =>{
    var ExtractJwt = passport_jwt.ExtractJwt;
    var JwtStrategy = passport_jwt.Strategy;
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'dangermouse'
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
    var strategy = new JwtStrategy(jwtOptions , (jwt_payload , next)=> {
      console.log('payload received', jwt_payload);
           mySqlCall((users)=>{
            users.findOneById({id: jwt_payload.id}, function(err, user) {
              console.log('User: ', user);
              if (user) {
                console.log(user);
                return next(null, user);
              }
              if (err) {
                return next(err, false);
              }
            });
           })
  })
    passport.use(strategy)
    app.post("/customer", function(req, res) {
      if(req.body.name && req.body.password){
        var name = req.body.name;
        var password = req.body.password;
      }
      mySqlCall(users=>{
      
        var user = null;
        for(let i=0 ; i<users.length ; i++){
          if(users[i].name == name){
            user = users[i]
          }
        }
        if( ! user ){
          res.status(401).json({message:"no such user found"});
        }
      
        if(user.password === req.body.password) {
          var payload = {id: user.id};
          var token = jwt.sign(payload, jwtOptions.secretOrKey);
          res.json({message: "ok", token: token});
        } else {
          res.status(401).json({message:"passwords did not match"});
        }
      })
     
    });
}