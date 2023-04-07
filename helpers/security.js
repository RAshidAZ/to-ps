const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
/**
 * It takes in a data object, a key, and a callback function. It then uses the jsonwebtoken library to
 * encrypt the data object using the key and the callback function
 * @param data - The data to be encrypted.
 * @param key - The secret key used to sign the token.
 * @param cb - The callback function that will be called when the encryption is complete.
 */
const encryptData = function (data, key, cb) {
    const signOptions = {
        issuer: "Authorization",
        subject: "iam@user.me",
        audience: "CUTSHORT",
        expiresIn: "1d", // 1 day validity
        algorithm: "HS256"
    };
    try {
        let encryptedData = jwt.sign(data, process.env.PASS_SALT_STATIC, signOptions);
        // console.log("encryptedData--------------------------------:", encryptedData)
        return cb(null, encryptedData);
    } catch (e) {
        console.log("-------error in encryption----", e)
        return cb(e);
    }

}
exports.encryptData = encryptData;


/**
 * It takes in an encrypted string, a key, and a callback function. It then tries to decrypt the
 * encrypted string using the key and the callback function. If it succeeds, it returns the decrypted
 * string. If it fails, it returns an error
 * @param encryptedData - The encrypted data that you want to decrypt.
 * @param key - The key used to encrypt the data.
 * @param cb - callback function
 */
const decryptData = function (encryptedData, key, cb) {
    try {
        const verifyOptions = {
            issuer: "Authorization",
            subject: "iam@user.me",
            audience: "CUTSHORT",
            expiresIn: "365d", // 365 days validity
            algorithm: "HS256"
        };
        let decryptedData = jwt.verify(encryptedData, process.env.PASS_SALT_STATIC, verifyOptions);
        // console.log("decryptedData", decryptedData)
        return cb(null, decryptedData);
    } catch (e) {
        return cb(e);
    }
}
exports.decryptData = decryptData;


/**
 * It takes the plaintext password, the hash, and the salt, and then it uses the crypto library to hash
 * the plaintext password with the salt, and then it compares the result to the hash
 * @param plaintextInput - The password that the user entered
 * @param hash - The hash that was stored in the database
 * @param salt - The salt that was used to hash the password
 * @param cb - callback function
 * @returns A boolean value
 */
const comparePassword = function (plaintextInput, hash, salt, cb) {
    console.log(plaintextInput, hash, salt)
    const crypto = require('crypto');
    const userSalt = Buffer.from(salt, 'base64')
    const hashResult = crypto.pbkdf2Sync(plaintextInput, userSalt, 10000, 64, 'sha1').toString('base64')
    console.log("🚀 ~ file: security.js ~ line 76 ~ comparePassword ~ hashResult", hashResult)
    if (hashResult === hash) {
        return cb(null, true)
    } else {
        return cb(null, false)
    }
};
exports.comparePassword = comparePassword;


/**
 * The function validates if the password and confirm password match.
 * @param password - The password parameter is a string that represents the password that the user
 * wants to set.
 * @param confirmPassword - The `confirmPassword` parameter is a string that represents the user's
 * confirmation of their chosen password. It is used to verify that the user has entered the same
 * password twice and to ensure that the password is correct.
 * @returns The function `validatePassword` returns a boolean value (`true` or `false`) depending on
 * whether the `password` and `confirmPassword` parameters are equal. If they are equal, the function
 * returns `true`, otherwise it returns `false`.
 */
const validatePassword = function (password, confirmPassword) {
    if (password === confirmPassword) {
        return true
    }else{
        return false
    }
}
exports.validatePassword = validatePassword

/**
 * Function to generates a password hash and salt using the plaintext input and
 * a random salt.
 * @param plaintext - The plaintext is the password that needs to be hashed and salted.
 * @param res - The `res` parameter is not used in the `generatePassword` function and can be removed.
 * @param cb - cb stands for "callback function". It is a function that is passed as an argument to
 * another function and is called back (executed) by that function when it has completed its task. In
 * this case, the generatePassword function takes a plaintext password, generates a salt, and uses the
 * pbk
 * @returns The `generatePassword` function is returning an object with two properties: `hash` and
 * `salt`. The `hash` property contains the hashed password generated using the `pbkdf2Sync` function,
 * and the `salt` property contains a randomly generated salt used in the hashing process. The function
 * also takes in two parameters: `plaintext` (the password to be hashed) and `res
 */
const generatePassword = function(plaintext, res, cb) {
    if (!cb) {
        cb = res
    }
    const salt = crypto.randomBytes(16).toString('base64')
    const randomSalt = Buffer(salt,'base64');
    const hash = crypto.pbkdf2Sync(plaintext, randomSalt, 10000, 64, 'sha1').toString('base64');
    
    return cb(null, {
        hash: hash,
        salt: salt
    })
};
exports.generatePassword = generatePassword;

const verifyDecryptedData = function(decryptedData, response, cb) {
    if(!cb){
        cb = response
    }
    let findData = {
        email: decryptedData.email,
        role: decryptedData.role
    };
    Users.findOne(findData, (err, user)=>{
        if(err){
            return cb({err, message: "Something went wrong!"});
        }
        if(!user){
            return cb({message: "No user found"})
        }
        if(user.isBlocked){
            return cb({message: "User blocked"})
        }
        return cb(null, user)
    })
}
exports.verifyDecryptedData = verifyDecryptedData;