const mongdb = require('mongodb');
const credentials = require('dotenv');
credentials.config();
const DATABASE_URL = process.env.DATABASE_URL_OFFLINE;

const mongodbClient = mongdb.MongoClient;

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
        // client.close();
        databaseFunction.clientCloser = client;
    });
}

module.exports = databaseFunction;