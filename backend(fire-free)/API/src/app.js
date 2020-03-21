
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
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const localStorage = require('../models/localStorage');

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