const crypto = require('crypto');

let salt = 'shouldBeHardToGuessAndUniqueForEachProjectAHAHAAHaba@132';

if (!process.env.PASSWORD_SALT) {
    console.log('Shutting down, in production and missing env. variable PASSWORD_SALT');
    process.exit();
}
else if (process.env.PASSWORD_SALT.length < 32) {
    console.log('Shutting down, env. variable PASSWORD_SALT too short.');
    process.exit();
}
else {
    salt = process.env.PASSWORD_SALT;
}

module.exports = function (password) {
    if (typeof password !== 'string') { return null; } // secure?
    return crypto
        .createHmac('sha256', salt) // choose algorithm and salt
        .update(password)  // send the string to encrypt
        .digest('hex'); // decide on output format (in our case hexadecimal)
}