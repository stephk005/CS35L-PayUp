import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();


// List all records, only function here for now
router.get('/', async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();

  console.log(results);
  res.send(results).status(200);
});


// Lists all entries in each database collection
router.get('/stats', async(req, res) => {
  let collections = await db.collections();
  let collection_list = collections.values();
  for(const col of collection_list)
    console.log(`Collection ${col.collectionName} has ${(await col.estimatedDocumentCount())} entries`);
  
  res.send("Received").status(200);
});


// Allows you to fetch a user based on their username
router.get("/user/username/:username", async (req, res) => {
  let collection = await db.collection("users");
  let query = {username: req.params.username};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// Allows you to fetch a user based on their email
router.get("/user/email/:email", async (req, res) => {
  let collection = await db.collection("users");
  let query = {email: req.params.email};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});


// Allows creation of a new user
router.post("/", async (req, res) => {
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  let collection = await db.collection("users");
  let result = await collection.insertOne(newUser);
  res.send(result).status(204);
});


export default router;