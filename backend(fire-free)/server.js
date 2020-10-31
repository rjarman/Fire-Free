const app = require('./src/app');
const port = process.env.PORT || 3000;
app.set('port', port);
require('http').createServer(app).listen(port);
