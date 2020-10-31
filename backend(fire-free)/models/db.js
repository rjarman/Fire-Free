require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL_ONLINE;
const mongodbClient = require('mongodb').MongoClient;

const databaseFunction = {
    clientCloser: null,
    doSignup: (data) => {
        sendData(process.env.DATABASE_NAME, process.env.ADMINS_COLLECTION, data);
    },
    doRegisters: (data) => {
        sendData(process.env.DATABASE_NAME, process.env.CUSTOMERS_COLLECTION, data);
    }
}

function sendData(databaseName, collectionName, data){

    mongodbClient.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if(err){
            console.log(`connection failed to "${databaseName}!"`);
            return;
        }else {
            console.log(`successfully connected to ${databaseName}!`);
        }

        const db = client.db(databaseName);
        const collection = db.collection(collectionName);
        collection.insertOne(data, (err, result) => {
            if(err){
                console.log(err);
            } else {
                console.log(`added to the database "${databaseName}" under collection "${collectionName}", successfully!`);
            }
        });
        databaseFunction.clientCloser = client;
    });
}

module.exports = databaseFunction;