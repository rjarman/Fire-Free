
/***
 *     _______           _______ _________ _______  _______ 
 *    (  ____ \|\     /|(  ____ \\__   __/(  ____ \(       )
 *    | (    \/( \   / )| (    \/   ) (   | (    \/| () () |
 *    | (_____  \ (_) / | (_____    | |   | (__    | || || |
 *    (_____  )  \   /  (_____  )   | |   |  __)   | |(_)| |
 *          ) |   ) (         ) |   | |   | (      | |   | |
 *    /\____) |   | |   /\____) |   | |   | (____/\| )   ( |
 *    \_______)   \_/   \_______)   )_(   (_______/|/     \|
 *                                                          
 */

const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const cors = require('cors');
const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const localStorage = require('../models/localStorage');
const dataStructures = require('../models/dataStructures');
const databaseFunction = require('../models/db');
const encryption_decryption = require('../miscellaneous/encryption');
const mongodbClient = mongodb.MongoClient;
const DATABASE_URL = process.env.DATABASE_URL_OFFLINE;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Rufsun\'s universe!</h1>');
});


app.use(cors({
    origin: '*',
    credentials: true
}));

var publicDir = require('path').join(__dirname,'../public/');
// console.log(publicDir);
app.use(express.static(publicDir));

/***
 *     _______ _________ _______  _______      _______  _______  _______  _______ 
 *    (  ____ \\__   __/(  ____ )(  ____ \    (  ____ \(  ____ )(  ____ \(  ____ \
 *    | (    \/   ) (   | (    )|| (    \/    | (    \/| (    )|| (    \/| (    \/
 *    | (__       | |   | (____)|| (__  _____ | (__    | (____)|| (__    | (__    
 *    |  __)      | |   |     __)|  __)(_____)|  __)   |     __)|  __)   |  __)   
 *    | (         | |   | (\ (   | (          | (      | (\ (   | (      | (      
 *    | )      ___) (___| ) \ \__| (____/\    | )      | ) \ \__| (____/\| (____/\
 *    |/       \_______/|/   \__/(_______/    |/       |/   \__/(_______/(_______/
 *                                                                                
 */

app.post('/RklSRS1GUkVF', (req, res, next) => {
    console.log('Date:' + new Date());
    console.log((Object.keys(req.body)[0]));
    // console.log(JSON.parse();
    // localStorage.addDataToLocalStorage('NodeData', Object.keys(req.body)[0]);
    // localStorage.

    res.send('200');
    // res.send('warning');
});

app.get('/RklSRS1GUkVF=2', (req, res, next) => {
    

    // data = JSON.parse(localStorage.getData('NodeData'));
     data = {
        "mq2":{
           "hydrogen":"0.00",
           "lpg":"0.00",
           "methane":"0.00",
           "carbonMonoxide":"0.00",
           "alcohol":"0.00",
           "smoke":"0.00",
           "propane":"0.00",
           "air":"inf"
        },
        "gps": {
            "date": "16-03-2020",
            "time": "09-32-50",
            "latitude": "25.743893",
            "longitude": "89.275230",
            "altitude": "10"
        }
     }
    res.status(200).json({
        status: 'success',
        data: data
    });
});

/***
 *     _        _______  _______ _________ _       
 *    ( \      (  ___  )(  ____ \\__   __/( (    /|
 *    | (      | (   ) || (    \/   ) (   |  \  ( |
 *    | |      | |   | || |         | |   |   \ | |
 *    | |      | |   | || | ____    | |   | (\ \) |
 *    | |      | |   | || | \_  )   | |   | | \   |
 *    | (____/\| (___) || (___) |___) (___| )  \  |
 *    (_______/(_______)(_______)\_______/|/    )_)
 *                                                 
 */

app.post('/RklSRS1GUkVF=login', (req, res, next) => {

    var form = new formidable.IncomingForm();
    var count = 0;
    var data = {};
    form.parse(req);
    form.on('field', (fieldName, fieldValue) => {
        switch (fieldName) {
            case 'email':
                Object.assign(data, {email: JSON.parse(fieldValue)});
                break;
            case 'password':
                Object.assign(data, {password: JSON.parse(fieldValue)});
                break;
        }
        if (count === 0 && Object.keys(data).length >= 2) {
            var loginData = new dataStructures.Login(data);
            mongodbClient.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                if(err){
                    console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
                    return;
                }else {
                    console.log(`successfully connected to "${process.env.DATABASE_NAME}"!`);
                }
                
                const db = client.db(process.env.DATABASE_NAME);
                const collection = db.collection(process.env.ADMINS_COLLECTION);

                collection.find({email: {$eq: loginData.email}}).toArray((err, result) => {
                    if(err){
                        console.log(`"${loginData.email}" doesn't match with the API key!`);
                    }else{
                        if(result.length === 0) {
                            res.status(200).json({
                                data: loginData.email,
                                status: '!registered'
                            });
                        }else {
                            if(encryption_decryption.decryption(Buffer.from(JSON.parse(result[0].password))) === loginData.password){
                                res.status(200).json({
                                    data: loginData.email,
                                    status: 'ok'
                                });
                            }else {
                                res.status(200).json({
                                    data: loginData.email,
                                    status: '!matched'
                                });
                            }
                            
                        }
                    }
                });
            });
            count++;
        }
    });
    
});

/***
 *     _______ _________ _______  _                 _______ 
 *    (  ____ \\__   __/(  ____ \( (    /||\     /|(  ____ )
 *    | (    \/   ) (   | (    \/|  \  ( || )   ( || (    )|
 *    | (_____    | |   | |      |   \ | || |   | || (____)|
 *    (_____  )   | |   | | ____ | (\ \) || |   | ||  _____)
 *          ) |   | |   | | \_  )| | \   || |   | || (      
 *    /\____) |___) (___| (___) || )  \  || (___) || )      
 *    \_______)\_______/(_______)|/    )_)(_______)|/       
 *                                                          
 */

app.post('/RklSRS1GUkVF=signup', (req, res, next) => {

    var form = new formidable.IncomingForm();
    var count = 0;
    var data = {};
    form.parse(req);
    form.on('fileBegin', (name, file) => {
        file.path = `${__dirname}/../public/adminsPhotos/${file.name}`;
    });
    form.on('field', (fieldName, fieldValue) => {
        switch (fieldName) {
            case 'imagePath':
                Object.assign(data, {imagePath: JSON.parse(fieldValue)});
                break;
            case 'userName':
                Object.assign(data, {userName: JSON.parse(fieldValue)});
                break;
            case 'email':
                Object.assign(data, {email: JSON.parse(fieldValue)});
                break;
            case 'password':
                Object.assign(data, {password: JSON.parse(fieldValue)});
                break;
        }
        if (count === 0 && Object.keys(data).length >= 4) {
            var signupData = new dataStructures.Signup(data);
            console.log(signupData);

            mongodbClient.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                if(err){
                    console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
                    return;
                }else {
                    console.log(`successfully connected to "${process.env.DATABASE_NAME}"!`);
                }
                
                const db = client.db(process.env.DATABASE_NAME);
                const collection = db.collection(process.env.ADMINS_COLLECTION);
        
                collection.find({email: {$eq: signupData.email}}).toArray((err, result) => {
                    if(err){
                        console.log(`"${signupData.email}" doesn't match with the API key!`);
                    }else{
                        if(result.length === 0) {
                            databaseFunction.doSignup(signupData);
                            res.status(201).json({
                                data: signupData.email,
                                status: 'ok'
                            });
                        }else {
                            res.status(201).json({
                                data: signupData.email,
                                status: 'registered'
                            });
                        }
                    }
                });
            });
            count++;
        }
    });
});

/***
 *     _______  _______  _______ _________ _______ _________ _______  _______ __________________ _______  _       
 *    (  ____ )(  ____ \(  ____ \\__   __/(  ____ \\__   __/(  ____ )(  ___  )\__   __/\__   __/(  ___  )( (    /|
 *    | (    )|| (    \/| (    \/   ) (   | (    \/   ) (   | (    )|| (   ) |   ) (      ) (   | (   ) ||  \  ( |
 *    | (____)|| (__    | |         | |   | (_____    | |   | (____)|| (___) |   | |      | |   | |   | ||   \ | |
 *    |     __)|  __)   | | ____    | |   (_____  )   | |   |     __)|  ___  |   | |      | |   | |   | || (\ \) |
 *    | (\ (   | (      | | \_  )   | |         ) |   | |   | (\ (   | (   ) |   | |      | |   | |   | || | \   |
 *    | ) \ \__| (____/\| (___) |___) (___/\____) |   | |   | ) \ \__| )   ( |   | |   ___) (___| (___) || )  \  |
 *    |/   \__/(_______/(_______)\_______/\_______)   )_(   |/   \__/|/     \|   )_(   \_______/(_______)|/    )_)
 *                                                                                                                
 */

app.post('/RklSRS1GUkVF=registration', (req, res, next) => {
    // console.log('registrations data: ' + req.body);

    var form = new formidable.IncomingForm();
    var count = 0;
    var data = {};
    form.parse(req);
    form.on('fileBegin', (name, file) => {
        file.path = `${__dirname}/../public/customerPhotos/${file.name}`;
    });
    form.on('field', (fieldName, fieldValue) => {
        switch (fieldName) {
            case 'imagePath':
                Object.assign(data, {imagePath: JSON.parse(fieldValue)});
                break;
            case 'consumerName':
                Object.assign(data, {consumerName: JSON.parse(fieldValue)});
                break;
            case 'email':
                Object.assign(data, {email: JSON.parse(fieldValue)});
                break;
            case 'contactNumber':
                Object.assign(data, {contactNumber: JSON.parse(fieldValue)});
                break;
            case 'macAddress':
                Object.assign(data, {macAddress: JSON.parse(fieldValue)});
                break;
        }
        if (count === 0 && Object.keys(data).length >= 5) {
            var consumer = new dataStructures.Consumer(data);

            mongodbClient.connect(DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                if(err){
                    console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
                    return;
                }else {
                    console.log(`successfully connected to "${process.env.DATABASE_NAME}"!`);
                }
                
                const db = client.db(process.env.DATABASE_NAME);
                const collection = db.collection(process.env.CUSTOMERS_COLLECTION);
        
                collection.find({macAddress: {$eq: consumer.macAddress}}).toArray((err, result) => {
                    if(err){
                        console.log(`"${consumer.macAddress}" doesn't match with the API key!`);
                    }else{
                        if(result.length === 0) {
                            databaseFunction.doRegisters(consumer);
                            res.status(201).json({
                                data: consumer.email,
                                status: 'ok'
                            });
                        }else {
                            res.status(200).json({
                                data: result[0].email,
                                status: 'registered'
                            });
                        }
                    }
                });
            });
            count++;
        }
    });
});

/***
 *     _______           _______ _________ _______  _______ 
 *    (  ____ \|\     /|(  ____ \\__   __/(  ____ \(       )
 *    | (    \/( \   / )| (    \/   ) (   | (    \/| () () |
 *    | (_____  \ (_) / | (_____    | |   | (__    | || || |
 *    (_____  )  \   /  (_____  )   | |   |  __)   | |(_)| |
 *          ) |   ) (         ) |   | |   | (      | |   | |
 *    /\____) |   | |   /\____) |   | |   | (____/\| )   ( |
 *    \_______)   \_/   \_______)   )_(   (_______/|/     \|
 *                                                          
 */

process.on('exit', (code) => {
    databaseFunction.clientCloser.close();
    console.log(`exit on status: '${code}'`);
});

process.on('SIGINT', () => {
    console.log("interrupted by external signal!");
    process.exit();
});

module.exports = app;