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

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fileSystem = require('fs');
const app = express();
const util = require('./util');
const databaseFunction = require('./db');
const crypto = require('./crypto');
const mongodbClient = require('mongodb').MongoClient;
const DATABASE_URL = process.env.DATABASE_URL_ONLINE;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.get('/', (req, res) => {
  res.send("<h1>Welcome to Rufsun's universe!</h1>");
});

app.use(
  require('cors')({
    origin: '*',
    credentials: true,
  })
);

const publicDir = require('path').join(__dirname, '../public/');
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
  console.log(Object.keys(req.body)[0]);
  res.send('200');
});

app.get('/RklSRS1GUkVF=2', (req, res, next) => {
  data = {
    mq2: {
      hydrogen: '0.00',
      lpg: '0.00',
      methane: '0.00',
      carbonMonoxide: '0.00',
      alcohol: '0.00',
      smoke: '0.00',
      propane: '0.00',
      air: 'inf',
    },
    gps: {
      date: '16-03-2020',
      time: '09-32-50',
      latitude: '25.743893',
      longitude: '89.275230',
      altitude: '10',
    },
  };
  res.status(200).json({
    status: 'success',
    data: data,
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
        Object.assign(data, { email: JSON.parse(fieldValue) });
        break;
      case 'password':
        Object.assign(data, { password: JSON.parse(fieldValue) });
        break;
    }
    if (count === 0 && Object.keys(data).length >= 2) {
      var loginData = new util.Login(data);
      mongodbClient.connect(
        DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
            return;
          } else {
            console.log(
              `successfully connected to "${process.env.DATABASE_NAME}"!`
            );
          }

          const db = client.db(process.env.DATABASE_NAME);
          const collection = db.collection(process.env.ADMINS_COLLECTION);

          collection
            .find({ email: { $eq: loginData.email } })
            .toArray((err, result) => {
              if (err) {
                console.log(
                  `"${loginData.email}" doesn't match with the API key!`
                );
              } else {
                if (result.length === 0) {
                  res.status(200).json({
                    data: loginData.email,
                    status: '!registered',
                  });
                } else {
                  if (
                    crypto.decryption(
                      Buffer.from(JSON.parse(result[0].password))
                    ) === loginData.password
                  ) {
                    res.status(200).json({
                      data: loginData.email,
                      status: 'ok',
                    });
                  } else {
                    res.status(200).json({
                      data: loginData.email,
                      status: '!matched',
                    });
                  }
                }
              }
            });
        }
      );
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
  Object.assign(data, { branch: '' });
  Object.assign(data, { contactNumber: '' });
  Object.assign(data, { designation: '' });
  Object.assign(data, { gender: '' });
  form.parse(req);
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/adminsPhotos/${file.name}`;
  });
  form.on('field', (fieldName, fieldValue) => {
    switch (fieldName) {
      case 'imagePath':
        Object.assign(data, { imagePath: JSON.parse(fieldValue) });
        break;
      case 'userName':
        Object.assign(data, { username: JSON.parse(fieldValue) });
        break;
      case 'email':
        Object.assign(data, { email: JSON.parse(fieldValue) });
        break;
      case 'password':
        Object.assign(data, { password: JSON.parse(fieldValue) });
        break;
    }
    if (count === 0 && Object.keys(data).length >= 8) {
      var signupData = new util.Signup(data);
      console.log(signupData);

      mongodbClient.connect(
        DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
            return;
          } else {
            console.log(
              `successfully connected to "${process.env.DATABASE_NAME}"!`
            );
          }

          const db = client.db(process.env.DATABASE_NAME);
          const collection = db.collection(process.env.ADMINS_COLLECTION);

          collection
            .find({ email: { $eq: signupData.email } })
            .toArray((err, result) => {
              if (err) {
                console.log(
                  `"${signupData.email}" doesn't match with the API key!`
                );
              } else {
                if (result.length === 0) {
                  databaseFunction.doSignup(signupData);
                  res.status(201).json({
                    data: signupData.email,
                    status: 'ok',
                  });
                } else {
                  res.status(201).json({
                    data: signupData.email,
                    status: 'registered',
                  });
                }
              }
            });
        }
      );
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
        Object.assign(data, { imagePath: JSON.parse(fieldValue) });
        break;
      case 'consumerName':
        Object.assign(data, { consumerName: JSON.parse(fieldValue) });
        break;
      case 'email':
        Object.assign(data, { email: JSON.parse(fieldValue) });
        break;
      case 'contactNumber':
        Object.assign(data, { contactNumber: JSON.parse(fieldValue) });
        break;
      case 'macAddress':
        Object.assign(data, { macAddress: JSON.parse(fieldValue) });
        break;
      case 'servedBy':
        Object.assign(data, { servedBy: JSON.parse(fieldValue) });
        break;
    }
    if (count === 0 && Object.keys(data).length >= 6) {
      var consumer = new util.Consumer(data);
      mongodbClient.connect(
        DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
            return;
          } else {
            console.log(
              `successfully connected to "${process.env.DATABASE_NAME}"!`
            );
          }

          const db = client.db(process.env.DATABASE_NAME);
          const collection = db.collection(process.env.CUSTOMERS_COLLECTION);

          collection
            .find({ macAddress: { $eq: consumer.macAddress } })
            .toArray((err, result) => {
              if (err) {
                console.log(
                  `"${consumer.macAddress}" doesn't match with the API key!`
                );
              } else {
                if (result.length === 0) {
                  databaseFunction.doRegisters(consumer);
                  res.status(201).json({
                    data: consumer.email,
                    status: 'ok',
                  });
                } else {
                  res.status(200).json({
                    data: result[0].email,
                    status: 'registered',
                  });
                }
              }
            });
        }
      );
      count++;
    }
  });
});

/***
 *     _______  ______  __________________
 *    (  ____ \(  __  \ \__   __/\__   __/
 *    | (    \/| (  \  )   ) (      ) (
 *    | (__    | |   ) |   | |      | |
 *    |  __)   | |   | |   | |      | |
 *    | (      | |   ) |   | |      | |
 *    | (____/\| (__/  )___) (___   | |
 *    (_______/(______/ \_______/   )_(
 *
 */

app.post('/RklSRS1GUkVF=admin', (req, res, next) => {
  var form = new formidable.IncomingForm();
  var count = 0;
  var data = {};
  var newImageName = '';
  form.parse(req);
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/adminsPhotos/${file.name}`;
    newImageName = file.name;
  });
  form.on('field', (fieldName, fieldValue) => {
    switch (fieldName) {
      case 'imagePath':
        Object.assign(data, { imagePath: JSON.parse(fieldValue) });
        break;
      case 'email':
        Object.assign(data, { email: JSON.parse(fieldValue) });
        break;
      case 'userName':
        Object.assign(data, { username: JSON.parse(fieldValue) });
        break;
      case 'gender':
        Object.assign(data, { gender: JSON.parse(fieldValue) });
        break;
      case 'contactNumber':
        Object.assign(data, { contactNumber: JSON.parse(fieldValue) });
        break;
      case 'branch':
        Object.assign(data, { branch: JSON.parse(fieldValue) });
        break;
      case 'designation':
        Object.assign(data, { designation: JSON.parse(fieldValue) });
        break;
    }
    if (count === 0 && Object.keys(data).length >= 7) {
      var admin = new util.Admin(data);
      mongodbClient.connect(
        DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
            return;
          } else {
            console.log(
              `successfully connected to "${process.env.DATABASE_NAME}"!`
            );
          }

          const db = client.db(process.env.DATABASE_NAME);
          const collection = db.collection(process.env.ADMINS_COLLECTION);

          collection
            .find({ email: { $eq: admin.email } })
            .toArray((err, result) => {
              if (err) {
                console.log(`"${admin.email}" doesn't match with the API key!`);
              } else {
                var adminPhotosPath = publicDir + 'adminsPhotos\\';
                fileSystem.readdir(adminPhotosPath, (err, imageList) => {
                  console.log(imageList);
                  if (imageList) {
                    for (var imageName of imageList) {
                      if (
                        imageName.split(admin.email.split('@')[0])[0] === '' &&
                        imageName !== newImageName &&
                        newImageName !== ''
                      ) {
                        fileSystem.unlink(
                          adminPhotosPath + imageName,
                          (err) => {
                            if (err) {
                              console.log(err);
                            }
                          }
                        );
                      }
                    }
                  }
                });
              }
            });

          collection.updateOne(
            {
              email: { $eq: admin.email },
            },
            {
              $set: {
                imagePath: admin.imagePath,
                username: admin.username,
                gender: admin.gender,
                contactNumber: admin.contactNumber,
                branch: admin.branch,
                designation: admin.designation,
              },
            },
            (err, result) => {
              if (result.modifiedCount) {
                res.status(201).json({
                  data: admin.email,
                  status: 'ok',
                });
              } else {
                res.status(200).json({
                  data: admin.email,
                  status: '!modified',
                });
              }
            }
          );
        }
      );
      count++;
    }
  });
});

/***
 *             _________ _______
 *    |\     /|\__   __/(  ____ \|\     /|
 *    | )   ( |   ) (   | (    \/| )   ( |
 *    | |   | |   | |   | (__    | | _ | |
 *    ( (   ) )   | |   |  __)   | |( )| |
 *     \ \_/ /    | |   | (      | || || |
 *      \   /  ___) (___| (____/\| () () |
 *       \_/   \_______/(_______/(_______)
 *
 */

app.post('/RklSRS1GUkVF=viewerData', (req, res, next) => {
  const viewerData = {
    adminData: {},
    consumerData: [],
  };
  mongodbClient.connect(
    DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
        return;
      } else {
        console.log(
          `successfully connected to "${process.env.DATABASE_NAME}"!`
        );
      }

      const db = client.db(process.env.DATABASE_NAME);
      const adminCollection = db.collection(process.env.ADMINS_COLLECTION);
      const consumerCollection = db.collection(
        process.env.CUSTOMERS_COLLECTION
      );
      adminCollection
        .find({ email: { $eq: req.body.email } })
        .toArray((err, adminData) => {
          if (err) {
            console.log(`"${req.body.email}" doesn't match with the API key!`);
          } else {
            consumerCollection
              .find({ servedBy: { $eq: adminData[0].email } })
              .toArray((err, consumerData) => {
                Object.assign(
                  viewerData.adminData,
                  new util.Admin(adminData[0])
                );
                for (var data of consumerData) {
                  viewerData.consumerData.push(new util.ConsumerViewer(data));
                }
                res.status(200).json({
                  adminData: viewerData.adminData,
                  consumerData: viewerData.consumerData,
                });
              });
          }
        });
    }
  );
});

/***
 *     _        _______ __________________ _______ _________ _______  _______ __________________ _______  _
 *    ( (    /|(  ___  )\__   __/\__   __/(  ____ \\__   __/(  ____ \(  ___  )\__   __/\__   __/(  ___  )( (    /|
 *    |  \  ( || (   ) |   ) (      ) (   | (    \/   ) (   | (    \/| (   ) |   ) (      ) (   | (   ) ||  \  ( |
 *    |   \ | || |   | |   | |      | |   | (__       | |   | |      | (___) |   | |      | |   | |   | ||   \ | |
 *    | (\ \) || |   | |   | |      | |   |  __)      | |   | |      |  ___  |   | |      | |   | |   | || (\ \) |
 *    | | \   || |   | |   | |      | |   | (         | |   | |      | (   ) |   | |      | |   | |   | || | \   |
 *    | )  \  || (___) |   | |   ___) (___| )      ___) (___| (____/\| )   ( |   | |   ___) (___| (___) || )  \  |
 *    |/    )_)(_______)   )_(   \_______/|/       \_______/(_______/|/     \|   )_(   \_______/(_______)|/    )_)
 *
 */

app.post('/RklSRS1GUkVF=notification', (req, res) => {
  new Promise((notificationData, reject) => {
    new Promise((tempNotificationData) => {
      mongodbClient.connect(
        DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
            return;
          } else {
            console.log(
              `successfully connected to "${process.env.DATABASE_NAME}"!`
            );
          }

          const db = client.db(process.env.DATABASE_NAME);

          const notificationCollection = db.collection(
            process.env.NOTIFICATION_COLLECTION
          );

          notificationCollection.find().toArray((err, _notificationData) => {
            if (err) {
              console.log(`Notification query err: ${err}`);
              reject(err);
            } else {
              if (_notificationData.length > 0) {
                tempNotificationData(_notificationData);
              } else {
                reject('noData');
              }
            }
          });
        }
      );
    }).then((tempNotificationData) => {
      mongodbClient.connect(
        DATABASE_URL,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client) => {
          if (err) {
            console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
            return;
          } else {
            console.log(
              `successfully connected to "${process.env.DATABASE_NAME}"!`
            );
          }

          const db = client.db(process.env.DATABASE_NAME);
          const hardwareCollection = db.collection(
            process.env.HARDWARE_DATA_COLLECTION
          );
          const consumerCollection = db.collection(
            process.env.CUSTOMERS_COLLECTION
          );

          let _notificationData = [];
          let _count = 0;
          tempNotificationData.forEach((tempNotificationDatum) => {
            new Promise((_notificationDatum) => {
              hardwareCollection
                .find({ macAddress: { $eq: tempNotificationDatum.macAddress } })
                .toArray((err, hardwareData) => {
                  if (err) {
                    console.log(`Hardware query err: ${err}`);
                  } else {
                    consumerCollection
                      .find({
                        macAddress: { $eq: tempNotificationDatum.macAddress },
                      })
                      .toArray((err, consumerData) => {
                        if (err) {
                          console.log(err);
                        } else {
                          _notificationDatum(
                            new util.Notification(
                              tempNotificationDatum.hardwareState,
                              tempNotificationDatum.solvedBy,
                              consumerData[0],
                              hardwareData[0]
                            )
                          );
                        }
                      });
                  }
                });
            }).then((_notificationDatum) => {
              _notificationData.push(_notificationDatum);
              if (tempNotificationData.length - 1 === _count) {
                notificationData(_notificationData);
              }
              _count++;
            });
          });
        }
      );
    });
  }).then(
    (notificationData) => {
      res.status(200).json({
        data: notificationData,
        status: 'ok',
      });
    },
    (reject) => {
      res.status(200).json({
        data: '',
        status: 'noData',
      });
    }
  );
});

/***
 *     _______  _______ _________     _______  _______  _               _______  ______
 *    (  ____ \(  ____ \\__   __/    (  ____ \(  ___  )( \    |\     /|(  ____ \(  __  \
 *    | (    \/| (    \/   ) (       | (    \/| (   ) || (    | )   ( || (    \/| (  \  )
 *    | (_____ | (__       | | _____ | (_____ | |   | || |    | |   | || (__    | |   ) |
 *    (_____  )|  __)      | |(_____)(_____  )| |   | || |    ( (   ) )|  __)   | |   | |
 *          ) || (         | |             ) || |   | || |     \ \_/ / | (      | |   ) |
 *    /\____) || (____/\   | |       /\____) || (___) || (____/\\   /  | (____/\| (__/  )
 *    \_______)(_______/   )_(       \_______)(_______)(_______/ \_/   (_______/(______/
 *
 */

app.post('/RklSRS1GUkVF=solvedNotification', (req, res) => {
  mongodbClient.connect(
    DATABASE_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        console.log(`connection failed to "${process.env.DATABASE_NAME}!"`);
        return;
      } else {
        console.log(
          `successfully connected to "${process.env.DATABASE_NAME}"!`
        );
      }

      const db = client.db(process.env.DATABASE_NAME);
      const notificationCollection = db.collection(
        process.env.NOTIFICATION_COLLECTION
      );

      notificationCollection.updateOne(
        {
          macAddress: { $eq: req.body.macAddress },
        },
        {
          $set: {
            hardwareState: 'solved',
            solvedBy: req.body.email,
          },
        },
        (err, result) => {
          if (result.modifiedCount) {
            res.status(201).json({
              data: req.body.macAddress,
              status: 'ok',
            });
          } else {
            res.status(200).json({
              data: req.body.macAddress,
              status: '!modified',
            });
          }
        }
      );
    }
  );
});

module.exports = app;
