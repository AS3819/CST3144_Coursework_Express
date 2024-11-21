"use strict";

//Imported functions.
import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";

//Website data.
const port = 8080;
let getItemsDatabase;
let getOrdersDatabase;

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
const ordersCollection = database.collection("Orders");

//Initialises website and database.
app.use(express.static("Public"));
app.use(bodyParser.json());

//Function for testing whether code is in the JSON format.
function testJSON(data) {
  let value = typeof data !== "string" ? JSON.stringify(data) : data;
  try {
    value = JSON.parse(value);
  } catch (e) {
    return false;
  }
  return typeof value === "object" && value !== null;
}

//Finds all documents in a collection.
async function findAll(collection, print) {
  const query = {};
  const results = await collection.find(query).toArray();
  getItemsDatabase = results;
  if (print) {
    console.log(results);
  }
}

async function find(collection, searchTerm, print) {
  const query = {searchTerm};
  const results = await collection.find(query).toArray();
  getItemsDatabase = results;
  if (print) {
    console.log(results);
  }
}

async function insertOne(collection, document) {
  if (testJSON(document)) {
    if (testJSON(document)) {
      const newDocument = document;
      const result = await collection.insertOne(newDocument);
      console.log(result);
    } else {
      console.log("Error. The data is not in the JSON format.");
    }
  }
}

findAll(itemsCollection, true);

//Function for returning the database in JSON format with a get request.
function handleItemsGetRequest(request, response) {
  findAll(itemsCollection, false);
  response.send(getItemsDatabase);
}

//Function for posting an order to the database.
function handleOrderPostRequest(request, response) {
  console.log(request);
  insertOne(ordersCollection, request.body);
  response.send({"message": "Data posted."});
}

//The HTTP requests.
app.get("/lessons", handleItemsGetRequest);
app.post("/orders", handleOrderPostRequest);

//Listens to the port.
app.listen(port);
console.log(`Listening on Port ${port}.`);
