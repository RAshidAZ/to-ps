const crypto = require('crypto');

const config = require('../config/index');
const Users = require('../models/user');


// Seeding User...........
const salt = crypto.randomBytes(16).toString('base64')
const randomSalt = Buffer.from(salt, 'base64')
let insertUser = [
    {
        name: "Admin",
        email: "superadmin@cutshort.com",
        accountId: "85217410",
        provider: "local",
        password: crypto.pbkdf2Sync('cutshort@123', randomSalt, 10000, 64, 'sha1').toString('base64'),
        salt: salt,
        role: "ADMIN"
    },
    {
        name: "Rashid",
        email: "rashid@cutshort.com",
        accountId: "81810606",
        provider: "local",
        password: crypto.pbkdf2Sync('cutshort@123', randomSalt, 10000, 64, 'sha1').toString('base64'),
        salt: salt,
        role: "USER"
    }
]
const seedUsers = ()=>{
    Users.find({}, (err, resp) => {
      if (resp.length > 0) {
        return;
      } else {
        Users.create(insertUser, (err, response) => {
            if(err){
              console.log("Unable to create user", err)
              return
            }
            console.log("User Created successfully!");
          });
      }
    });
}

seedUsers();