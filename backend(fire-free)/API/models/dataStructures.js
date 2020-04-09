const encryption_decryption = require('../miscellaneous/encryption');

module.exports = {
    Signup: function signup (data) {
        this.imagePath = data.imagePath[0];
        this.username = data.userName;
        this.email = data.email;
        this.password = JSON.stringify(encryption_decryption.encrytion(data.password));
    },
    Login: function login(data) {
        this.email = data.email;
        this.password = data.password;
    }
};