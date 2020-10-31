const encryption_decryption = require('../miscellaneous/encryption');

module.exports = {
    Signup: function signup (data) {
        this.imagePath = data.imagePath[0];
        this.username = data.username;
        this.email = data.email;
        this.branch = data.branch;
        this.contactNumber = data.contactNumber;
        this.designation = data.designation;
        this.gender = data.gender;
        this.password = JSON.stringify(encryption_decryption.encryption(data.password));
    },
    Login: function login(data) {
        this.email = data.email;
        this.password = data.password;
    },
    Consumer: function consumer(data) {
        this.imagePath = data.imagePath[0];
        this.consumerName = data.consumerName;
        this.email = data.email;
        this.contactNumber = data.contactNumber;
        this.macAddress = data.macAddress;
        this.servedBy = data.servedBy;
    },
    ConsumerViewer: function consumer(data) {
        this.imagePath = data.imagePath;
        this.consumerName = data.consumerName;
        this.email = data.email;
        this.contactNumber = data.contactNumber;
        this.macAddress = data.macAddress;
        this.servedBy = data.servedBy;
    },
    Admin: function admin(data) {
        this.imagePath = data.imagePath;
        this.username = data.username;
        this.email = data.email;
        this.branch = data.branch;
        this.contactNumber = data.contactNumber;
        this.designation = data.designation;
        this.gender = data.gender;
    },
    Notification: function notification(hardwareState, solvedBy, consumerData, hardwareData) {
        this.hardwareState = hardwareState;
        this.solvedBy = solvedBy;
        this.consumerData = consumerData;
        this.hardwareData = hardwareData;
    }
};