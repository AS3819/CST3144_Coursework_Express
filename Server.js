"use strict";

//Imported functions.
import express from "express";

//Website data.
const port = 8080;

//Opens the Express server and created a path for the MongoDB server.
const app = express();

app.use(express.static("Public"));

app.listen(port);
console.log(`Listening on Port ${port}.`);