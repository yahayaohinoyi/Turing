var bcrypt = require('bcrypt')
function generateSalt(password){
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

function genHash(salt , password){
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
function reHash(initialHash , password){
    salt = initialHash.substr(0,30) ;
    return new Promise((resolve , reject)=>{
      bcrypt.hash(password , salt , (err,reHash)=>{
        if(err){
            reject(err)
          }
          else{
            resolve({
              reHash:reHash,
              initialHash:initialHash,
              password:password
  
            })
          }
      })
      
    })
  }
 generateSalt('yahaya')
  .then((result)=>{
    return genHash(result.salt,result.password)
  }).then((result)=>{
      return result
  }).then((m)=>{
      return reHash(m.hash,m.password)
  }).then((res)=>{
      console.log(res)
      if(res.reHash == res.initialHash){
          console.log('deylablood')
      }
  }).catch((err)=>{
      console.log(err.reHash == err.initialHash)
  })
      
  
 