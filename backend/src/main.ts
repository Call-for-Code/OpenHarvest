import path from "path";
import fs from 'fs'
import express from "express";
import session from "express-session";
import https from 'https'
import passport from "passport";
import { IDaaSOIDCStrategy as OpenIDConnectStrategy } from "passport-ci-oidc";
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

// var OpenIDConnectStrategy = require('passport-ci-oidc').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
    discoveryURL: process.env.AUTH_discovery_url,
    clientID: process.env.AUTH_client_id,
    scope: 'email',
    response_type: 'code',
    clientSecret: process.env.AUTH_client_secret,
    callbackURL: process.env.AUTH_callback_url,
    skipUserProfile: true},
    function (iss, sub, profile, accessToken, refreshToken, params, done) {
        process.nextTick(function () {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        })
    }
)

passport.use(Strategy); 

app.get('/', function(req, res) {
    res.send('<h2>IBMid Node.js Sample App</h2><br /><a href="/hello">click to check your user info</a><br/>'+'<br />');
});

app.get('/login', passport.authenticate('openidconnect', { state: Math.random().toString(36).substr(2, 10) }));

app.get('/auth/sso/callback', function (req, res, next) {
    // @ts-ignore
    let redirect_url = "/app";
    if (process.env.NODE_ENV == "production") {
        redirect_url = req.session.originalUrl;
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

function ensureAuthenticated(req, res, next) {
    // console.log(req);
    if (!req.isAuthenticated()) {
        console.info("Unauthenticated request. Trying to Authenticate");
        req.session.originalUrl = req.originalUrl;
        res.redirect('/login');
    } else {
        return next();
    }
}


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

export interface CoopManagerUser {
    id: string;
    email_verified: boolean
    displayName: string;
    given_name: string;
    name: string;
    family_name: string;
    iss: number;
    aud: number;
    sub: number;
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
}

function formatUser(user: any): CoopManagerUser {
  return {
    id: user.id,
    email_verified: user._json.email_verified,
    displayName: user.displayName,
    given_name: user._json.given_name,
    name: user._json.name,
    family_name: user._json.family_name,
    iss: user._json.iss,
    aud: user._json.aud,
    sub: user._json.sub,
    iat: user._json.iat,
    exp: user._json.exp,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken
  }
}

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

// start node server
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV == "production") {
    app.listen(port, function() {
        console.log("Server starting on http://localhost:" + port);
    });

}
else {
    const sslKey = process.env['SSL_Key'];
    const sslCert = process.env['SSL_Cert'];
    if (sslKey == undefined || sslCert == undefined) {
        console.error("SSL is required in Dev for Authentication. Please set SSL_Key, SSL_Cert in your environment");
        process.exit(-1);
    }

    https.createServer({
        key: fs.readFileSync(sslKey!!),
        cert: fs.readFileSync(sslCert!!)
    }, app).listen(port);

    console.log("Server starting on https://localhost:" + port);
}


// app.listen(port, () => {
//     console.log(`App UI available http://localhost:${port}`);
// });

// error handler for unmatched routes or api calls
app.use((req, res) => {
    res.status(404);
});

module.exports = app;
