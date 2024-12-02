"use strict";

//Imported functions.
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { MongoClient, ServerApiVersion } from "mongodb";
import { fileURLToPath } from "url";

//Website data.
const port = 10000;
let getItemsDatabase;
let getOrdersDatabase;

//Opens the Express server and created a path for the MongoDB server.
const app = express();
const username = "AS3819";
const password = "mBWXKo2fCFixEEwm";
const databaseName = "CST3144_Coursework";
const connectionURILocal = "mongodb://127.0.0.1:27017?retryWrites=true&w=majority";
const connectionURI = `mongodb+srv://${username}:${password}@fsdcluster.0giwf.mongodb.net/${databaseName}?retryWrites=true&w=majority&ssl=true&sslValidate=false"`;

//Opens the MongoDB server.
const client = new MongoClient(connectionURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});


//Connects to the MongoDB server.
const database = client.db(databaseName);
const itemsCollection = database.collection("Items");
const ordersCollection = database.collection("Orders");

//Initialises website and database.
app.use(express.static("Public"));
app.use(bodyParser.json());
app.use(cors());

//Logger function for the middleware.
function logger(request, response, next) {
  const currentTime = new Date().toISOString();
  console.log({
    time: `${currentTime}`,
    method: `${request.method}`,
    url: `${request.url}`,
  });
  next();
}

//Configures the server to use the logger middleware.
app.use(logger);

//Static image middleware.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagePath = path.resolve(__dirname, "Static");

app.use("/static", (req, res, next) => {
  const filePath = path.join(imagePath, req.path);
  console.log(`Checking for file at path: ${filePath}`);
  fs.access(filePath, fs.constants.F_OK, (error) => {
    if (error) {
      console.log(`File not found: ${filePath}`);
      res.status(404).send({ error: "Image not found.", idiot: imagePath, dolt: filePath });
    } else {
      console.log(`File exists: ${filePath}`);
      next();
    }
  });
});

app.use('/static', express.static(imagePath));

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

async function find(collection, query, print) {
  const results = await collection.find(query).toArray();
  getItemsDatabase = results;
  if (print) {
    console.log(results);
  }
}

async function findOneAndUpdate(
  collection,
  searchTerm,
  updateParameters,
  print
) {
  const query = { searchTerm };
  if (testJSON(updateParameters)) {
    const result = await collection.findOneAndUpdate(
      searchTerm,
      updateParameters
    );
    if (print) {
      console.log(result);
    }
  } else {
    console.log("Error. The data is not in the JSON format.");
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

//Function for returning the database in JSON format with a get request.
function handleItemsGetRequest(request, response) {
  findAll(itemsCollection, false);
  response.send(getItemsDatabase);
}

//Function for updating lessons.
function handleItemsPutRequest(request, response) {
  const searchTerm = request.body.searchTerm;
  const updateParameter = request.body.updateParameter;
  findOneAndUpdate(itemsCollection, searchTerm, updateParameter, false);
  response.send({ message: "Data updated.", id: request.body.searchTerm.id });
}

//Function for posting an order to the database.
function handleOrderPostRequest(request, response) {
  console.log(request);
  insertOne(ordersCollection, request.body);
  response.send({
    message: "Data posted.",
    name: request.body.name,
    telephoneNumber: request.body.telephoneNumber,
  });
}

//Function for searching the list of items.
function searchItemsGetRequest(request, response) {
  try {
    const searchTerm = request.query.q;
    let isNumber = true;
    console.log(searchTerm);
    try {
      const test = Number(JSON.parse(searchTerm));
      console.log(true);
    } catch (error) {
      isNumber = false;
      console.log(false);
    }
    let query;
    if (isNumber) {
      query = {
        $or: [
          { id: JSON.parse(searchTerm) },
          { title: { $regex: searchTerm, $options: "i" } },
          { classType: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
          { price: JSON.parse(searchTerm) },
          { spaces: JSON.parse(searchTerm) },
        ],
      };
    } else {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { classType: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    find(itemsCollection, query, true);
    response.send(getItemsDatabase);
  } catch (error) {
    response.status(500).send({ error: "Internal Server Error", code: 500 });
  }
}

//The HTTP requests.
app.get("/lessons", handleItemsGetRequest);
app.put("/lessons", handleItemsPutRequest);
app.post("/orders", handleOrderPostRequest);
app.get("/search", searchItemsGetRequest);

//Listens to the port.
app.listen(port);
console.log(`Listening on Port ${port}.`);

//Maths icon source: <a target="_blank" href="https://icons8.com/icon/QM0dP5g8D4UH/math">Math</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//English icon source: <a target="_blank" href="https://icons8.com/icon/shCl9WoAcTSQ/english-language">English Language</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Computer icon source: <a target="_blank" href="https://icons8.com/icon/x96urEIUGUBd/computer">Computer</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Geography icon source: <a target="_blank" href="https://icons8.com/icon/43164/earth-globe">Geography</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Electrical engineering icon source: <a target="_blank" href="https://icons8.com/icon/1bDkft42EP0K/electrical">Electrical</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Chess icon source: <a target="_blank" href="https://icons8.com/icon/qYPfEYiRyUha/chesspiece">Chesspiece</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//History icon source: <a target="_blank" href="https://icons8.com/icon/b8XZx9M6aR0i/history">History</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Chemistry icon source: <a target="_blank" href="https://icons8.com/icon/58776/periodic-table-of-elements">Chemistry</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>

//Example put request:
/*
{
  "searchTerm": {
      "classType": "Electrical Engineering"
  },
  "updateParameter": {
      "$set": {
          "price": 300
      }
  }
}
*/

//Example put request:
/*
{
  "searchTerm": {
      "classType": "Electrical Engineering"
  },
  "updateParameter": {
      "$set": {
          "price": 300
      }
  }
}
*/