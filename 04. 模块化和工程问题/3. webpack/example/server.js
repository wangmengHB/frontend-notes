let express = require('express');
let app = express();
let http = require('http');
let path = require('path');


let dir = path.join(__dirname, './dist');
app.use(express.static(dir));
let server = http.createServer(app);
server.listen(3000);

console.log('http://localhost:3000');