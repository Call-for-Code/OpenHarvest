import express from "express";
import session from "express-session";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import 'dotenv/config';

import { mongoInit } from "./db/mongodb";

import farmerRoutes from "./routes/farmer-route";
import authRoutes from "./routes/auth-route";
import lotRoutes from "./routes/lot-route";
import cropRoutes from "./routes/crop-route";
import dashboardRoutes from "./routes/dashboard-route";
import recommendationsRoutes from "./routes/recommendations-route";

import weatherRoutes from "./routes/weather-route";

mongoInit();

const app = express();

app.use(cors());

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable session
app.use(session({
    secret: "test",
    resave: true,
    saveUninitialized: true}));

app.use(express.static(path.join("public")));

// routes and api calls
// app.use('/api', healthRoutes);
// app.use('/api/names', nameRoutes);

app.use("/api/farmer", farmerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lot", lotRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.use("/api/weather", weatherRoutes);

// start node server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`App UI available http://localhost:${port}`);
});

// error handler for unmatched routes or api calls
app.use((req, res) => {
    res.status(404);
});

module.exports = app;
