import path from "path";
import fs from 'fs'
import express from "express";
import session from "express-session";
import https from 'https'
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';

import { mongoInit } from "./db/mongodb";

import farmerRoutes from "./routes/farmer-route";
import lotRoutes from "./routes/lot-route";
import cropRoutes from "./routes/crop-route";
import dashboardRoutes from "./routes/dashboard-route";
import recommendationsRoutes from "./routes/recommendations-route";
import weatherRoutes from "./routes/weather-route";
import coopManagerRoutes from "./routes/coopManager-route";
import organisationRoutes from "./routes/organisation-route";
import messageLogRoutes from "./routes/messaging-route";
import smsRoutes from "./routes/sms-route";

import { formatUser, ensureAuthenticated } from "./auth/helpers";
import { IBMidStrategy } from "./auth/IBMiDStrategy";
import { SocketIOManager, SocketIOManagerInstance } from "./sockets/socket.io";
import { Server } from "http";

mongoInit();

const app = express();

app.use(cors());

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable session
app.use(cookieParser());
app.use(session({
    secret: "test",
    resave: true,
    saveUninitialized: true}));

app.use(express.static(path.join("public")));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(IBMidStrategy); 

app.get('/login', passport.authenticate('openidconnect', { state: Math.random().toString(36).substr(2, 10) }));

app.get('/auth/sso/callback', function (req, res, next) {
    // @ts-ignore
    let redirect_url = "/app";
    if (process.env.NODE_ENV == "production") {
        redirect_url = req.session.originalUrl;
        redirect_url = "https://openharvest.net/";
    }
    else {
        redirect_url = "http://localhost:3001/";
    }
    passport.authenticate('openidconnect', {
        successRedirect: redirect_url,
        // successRedirect: '/hello',
        failureRedirect: '/failure'
    })(req, res, next);
});

// failure page
app.get('/failure', function(req, res) {
    res.send('login failed'); 
});


app.get('/hello', ensureAuthenticated, function (req, res) {
   var claims = req.user['_json'];
   var html ="<p>Hello " + claims.given_name + " " + claims.family_name + ": </p>";

   html += "User details (ID token in _json object): </p>";

   html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";

   html += "<br /><a href=\"/logout\">logout</a>";

   html += "<hr> <a href=\"/\">home</a>";

   //res.send('Hello '+ claims.given_name + ' ' + claims.family_name + ', your email is ' + claims.email + '<br /> <a href=\'/\'>home</a>');

   res.send(html);
});



app.get('/me', ensureAuthenticated, (req, res) => {
    return res.json(formatUser(req.user));
});

// routes and api calls
// app.use('/api', healthRoutes);
// app.use('/api/names', nameRoutes);

app.use("/api/farmer", farmerRoutes);
app.use("/api/lot", lotRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.use("/api/weather", weatherRoutes);
app.use("/api/coopManager", coopManagerRoutes);
app.use("/api/organisation", organisationRoutes);
app.use("/api/messaging", messageLogRoutes);
app.use("/api/sms", smsRoutes);

app.get("/", ensureAuthenticated, express.static("public"));

let server: Server;

// start node server
const port = process.env.PORT || 3000;
const sslKey = process.env['SSL_Key'];
const sslCert = process.env['SSL_Cert'];
if (sslKey == undefined || sslCert == undefined) {
    console.error("SSL is required. Please set SSL_Key, SSL_Cert in your environment");
    process.exit(-1);
}

let isSSLFile = sslKey.includes(".pem")

// Listen on https
server = https.createServer({
    key: isSSLFile ? fs.readFileSync(sslKey) : sslKey,
    cert: isSSLFile ? fs.readFileSync(sslCert) : sslCert
}, app).listen(port);

console.log("Server starting on https://localhost:" + port);

// Listen on http at 3080
app.listen(3080, function() {
    console.log("Server starting on http://localhost:" + 3080);
});

SocketIOManagerInstance.initialise(server);

app.use((req, res) => {
    res.status(404);
});

module.exports = app;
