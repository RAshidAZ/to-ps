'use strict';
module.exports = function(role){

    return function(req, res,next){
        if(!role.length){
            console.log("NO ROLE PASSED")
        }
        if(role.includes(req.data.authUser.role)){
            next();
        }else{
            return res.status(403).send({
                signature: req.data.signature,
                status: 401,
                message: "You're not allowed.",
                error: true
            });
        }
  
    }
}