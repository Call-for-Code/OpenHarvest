import path from "path";
import fs from 'fs'
import express from "express";
import session from "express-session";
import https from 'https';
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
import foodTrustRoutes from "./routes/food-trust-route";
import weightRoutes from "./routes/weights-route"

import { SocketIOManager, SocketIOManagerInstance } from "./sockets/socket.io";
import { Server } from "http";
import { AuthRoutes } from "./auth/auth-route";

mongoInit();

const app = express();

app.use(cors());

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable session for the sole reason of passport-ci-oidc. WE ARE NOT SUPPORTING SESSION BASED AUTH
app.use(cookieParser());
app.use(session({
    secret: process.env.jwt_secret!!,
    resave: true,
    saveUninitialized: true
}));

// Passport
// app.use(passport.initialize()); // This is only needed if we're using sessions: https://stackoverflow.com/a/56095662
// app.use(passport.session());



// routes and api calls
// app.use('/api', healthRoutes);
// app.use('/api/names', nameRoutes);
app.use("/auth/", AuthRoutes);

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

// blockchain related routes
app.use("/api/foodtrust", foodTrustRoutes)
app.use("/api/weights", weightRoutes)

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

}
else {
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
