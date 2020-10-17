var express = require('express'),
    http = require('http'),
    ParseServer = require('parse-server').ParseServer,
    ParseDashboard = require('parse-dashboard');

var app = express();
const port = process.env.PORT || 1337;
var settings = {
    "appId": process.env.APPLICATION_ID || "APPLICATION_ID",
    "appName": process.env.APPLICATION_NAME || "Shadow Network",
    "masterKey": process.env.MASTER_KEY || "MASTER_KEY",
    "databaseURI": process.env.DB_URI || "mongodb://localhost:27017/thebasicmongo",
    "mountPath": process.env.MOUNT_PATH || "/parse/1",
    "cloud": process.env.CLOUD_CODE_MAIN || "cloud/main.js",
    "verbose": true,
    "publicServerURL": process.env.PUBLIC_SERVER_URL || "http://localhost:1337/parse/1",
    "serverURL": "http://0.0.0.0:" + port + "/parse/1"
};

var dashboardSettings = {
    "apps": [
        {
            "serverURL": process.env.PUBLIC_SERVER_URL || ("http://localhost:" + port + "/parse/1"),
            "appId": process.env.APPLICATION_ID || "APPLICATION_ID",
            "masterKey": process.env.MASTER_KEY || "MASTER_KEY",
            "appName": process.env.APPLICATION_NAME || "Shadow Network"
        }
    ],
    "users": [
        {
            "user": process.env.DASHBOARD_ADMIN || "tmp",
            "pass": process.env.DASHBOARD_PASSWORD || "tmp"
        }
    ]
}

var api = new ParseServer(settings);
app.use('/parse/1', api);

var dashboard = new ParseDashboard(dashboardSettings, { allowInsecureHTTP: true});
app.use('/apps', dashboard);

http.createServer(app).listen(port, '0.0.0.0');