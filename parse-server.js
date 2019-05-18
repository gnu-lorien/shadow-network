var express = require('express'),
    http = require('http'),
    ParseServer = require('parse-server').ParseServer;

var app = express();
const port = process.env.PORT || 1337;
var settings = {
    "appId": process.env.APPLICATION_ID || "APPLICATION_ID",
    "appName": process.env.APPLICATION_NAME || "Shadow Network",
    "masterKey": process.env.MASTER_KEY || "MASTER_KEY",
    "databaseURI": process.env.MONGODB_URI || "mongodb://localhost:27017/thebasicmongo",
    "mountPath": process.env.MOUNT_PATH || "/parse/1",
    "cloud": process.env.CLOUD_CODE_MAIN || "cloud/main.js",
    "verbose": true,
    "publicServerURL": process.env.PUBLIC_SERVER_URL || "https://localhost:1337/parse/1",
    "serverURL": "http://0.0.0.0:" + port + "/parse/1"
};

var api = new ParseServer(settings);
app.use('/parse/1', api);

http.createServer(app).listen(port, '0.0.0.0');