"use strict";

//Imported functions.
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";

//Website data.
const port = 8080;
let getItemsDatabase;

//Opens the Express server and created a path for the MongoDB server.
const app = express();
const connectionURI = "mongodb://127.0.0.1:27017?retryWrites=true&w=majority";

//Opens the MongoDB server.
const client = new MongoClient(connectionURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

//Connects to the MongoDB server.
const database = client.db("CST3144_Coursework");
const itemsCollection = database.collection("Items");

//Initialises website and database.
app.use(express.static("Public"));

//Finds all documents in a collection.
async function find(collection, print) {
  const query = {};
  const results = await collection.find(query).toArray();
  getItemsDatabase = results;
  if (print) {
    console.log(results);
  }
}

find(itemsCollection, true);

//Function for returning the database in JSON format with a get request.
function handleItemsGetRequest(request, response) {
  find(itemsCollection, false);
  response.send(getItemsDatabase);
}

//The HTTP requests.
app.get("/Lessons", handleItemsGetRequest);

//Listens to the port.
app.listen(port);
console.log(`Listening on Port ${port}.`);
