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
// import lotRoutes from "./routes/lot-route";
import cropRoutes from "./routes/crop-route";
import dashboardRoutes from "./routes/dashboard-route";
import recommendationsRoutes from "./routes/recommendations-route";
import weatherRoutes from "./routes/weather-route";
import userRoutes from "./routes/user-route";
import organisationRoutes from "./routes/organisation-route";
import messageLogRoutes from "./routes/messaging-route";
import smsRoutes from "./routes/sms-route";
import foodTrustRoutes from "./routes/food-trust-route";

import { ensureAuthenticated, formatUser } from "./auth/helpers";
import { IBMidStrategy } from "./auth/IBMiDStrategy";
import { SocketIOManagerInstance } from "./sockets/socket.io";
import { Server } from "http";

mongoInit().then(() => console.log("Connected to DB"));

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
    saveUninitialized: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// @ts-ignore
passport.serializeUser(function(user, done) {
    done(null, user);
});

// @ts-ignore
passport.deserializeUser(function(obj, done) {
    // @ts-ignore
    done(null, obj);
});

passport.use(IBMidStrategy); 

app.get('/login', passport.authenticate('openidconnect', { state: Math.random().toString(36).substr(2, 10) }));

app.get('/auth/sso/callback', function (req, res, next) {
    let redirect_url;
    if (process.env.NODE_ENV == "production") {
        // @ts-ignore
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
    // @ts-ignore
   const claims = req.user['_json'];
   let html ="<p>Hello " + claims.given_name + " " + claims.family_name + ": </p>";

   html += "User details (ID token in _json object): </p>";

    // @ts-ignore
   html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";

   html += "<br /><a href=\"/logout\">logout</a>";

   html += "<hr> <a href=\"/\">home</a>";

   //res.send('Hello '+ claims.given_name + ' ' + claims.family_name + ', your email is ' + claims.email + '<br /> <a href=\'/\'>home</a>');

   res.send(html);
});



app.get('/me', ensureAuthenticated, (req, res) => {
    // @ts-ignore
    return res.json(formatUser(req.user));
});

// routes and api calls
// app.use('/api', healthRoutes);
// app.use('/api/names', nameRoutes);

app.use("/api/farmer", farmerRoutes);
// app.use("/api/lot", lotRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.use("/api/weather", weatherRoutes);
app.use("/api/foodtrust", foodTrustRoutes)
app.use("/api/coopManager", userRoutes);
app.use("/api/organisation", organisationRoutes);
app.use("/api/messaging", messageLogRoutes);
app.use("/api/sms", smsRoutes);

// Static Files
const publicPath = path.resolve("public");
console.log("React App being served from:", publicPath);

app.use("/", express.static(publicPath));

// Otherwise default to sending the front end
app.use((req, res) => {
    if (req.method === "GET") {
        res.sendFile(path.join(publicPath, "index.html"));    
    }
    else {
        res.status(404).end();
    }
});


let server: Server;

// start node server
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV == "production") {
    server = app.listen(port, function() {
        console.log("Server starting on http://localhost:" + port);
    });

} else {
    const sslKey = process.env['SSL_Key'];
    const sslCert = process.env['SSL_Cert'];
    if (sslKey == undefined || sslCert == undefined) {
        console.error("SSL is required in Dev for Authentication. Please set SSL_Key, SSL_Cert in your environment");
        process.exit(-1);
    }

    // Listen on https at 3000
    server = https.createServer({
        key: fs.readFileSync(sslKey!!),
        cert: fs.readFileSync(sslCert!!)
    }, app).listen(port);

    console.log("Server starting on https://localhost:" + port);
    
    // Listen on http at 3080
    app.listen(3080, function() {
        console.log("Server starting on http://localhost:" + 3080);
    });
}

SocketIOManagerInstance.initialise(server);

module.exports = app;
