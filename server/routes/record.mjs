import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();


/* TABLE OF COMMANDS + URIs

  GENERAL:
    List all documents: /stats

  USER:
    List all users: /user
    Retrieve user: /user/:user_id
    Retrieve user via username: /user/username/:username
    Retrieve user via email: /user/email/:email
    Create new user: /user/create
    Insert new friend: /group/insert/friend/:user_id
    Insert new group: /group/insert/group/:user_id
    Pop friend: /group/pop/friend/:user_id
    Pop group: /group/pop/group/:user_id
    Delete user: /user/delete/:user_id

  GROUP:
    List all groups: /group
    Retrieve group: /group/:group_id
    Create new group: /group/create
    Insert new user: /group/insert/user/:group_id
    Insert new transaction: /group/insert/transaction/:group_id
    Pop user: /group/pop/user/:group_id
    Pop transaction: /group/pop/transaction/:group_id
    Delete group: /group/delete/:group_id

  TRANSACTION:
    List all transactions: /transaction
    Retrieve transaction: /transaction/:transaction_id
    Create new transaction: /transaction/create
    Update transaction amount: /transaction/update/:transaction_id
    Delete transaction: /transaction/delete/:transaction_id
*/

// ==================================================== STATUS FUNCTIONS ==========================================================


// Lists all entries in each database collection
router.get('/stats', async(req, res) => {
  let collections = await db.collections();
  let collection_list = collections.values();
  for(const col of collection_list)
    console.log(`Collection ${col.collectionName} has ${(await col.estimatedDocumentCount())} entries`);
  
  res.send("Received").status(200);
});


// ================================================== USER DOCUMENT FUNCTIONS =====================================================


// List all user records
router.get('/user', async (req, res) => {
  let collection = await db.collection("users");
  let results = await collection.find({}).toArray();

  console.log(results);
  res.send(results).status(200);
});


// Allows you to fetch a user based on their id
router.get("/user/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = {_id:  new ObjectId(req.params.id)};
  let projection = {_id: 1};
  let result = await collection.findOne(query, projection);

  if (result) res.send(result).status(200);
  else res.send("FETCH_ERROR").status(404);  // Not found
});


// Allows you to fetch a user based on their username
router.get("/user/username/:username", async (req, res) => {
  let collection = await db.collection("users");
  let query = {username: req.params.username};
  let projection = {_id: 1};
  let result = await collection.findOne(query, projection);

  if (result) res.send(result).status(200);
  else res.send("FETCH_ERROR").status(404);  // Not found
});


// Allows you to fetch a user based on their email
router.get("/user/email/:email", async (req, res) => {
  let collection = await db.collection("users");
  let query = {email: req.params.email};
  let projection = {_id: 1};
  let result = await collection.findOne(query, projection);

  if (result) res.send(result).status(200);
  else res.send("FETCH_ERROR").status(404);  // Not found
});


// Allows creation of a new user
router.post("/user/create", async (req, res) => {

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    groups: req.body.groups,  // list of _id (groups)
    friends: req.body.friends  // list of _id (users)
  };

  if(Object.values(newUser).includes(undefined)){
    res.send("KEY_ERROR").status(400);  // Keys not provided proper values
    return;
  }

  let collection = await db.collection("users");
  let result = await collection.insertOne(newUser);

  if(result) res.send(result.insertedId).status(201);
  else res.send("CREATE_ERROR").status(500);  // Insertion failed
});


// Allows addition of new friend (should pass user ID)
router.patch("/user/insert/friend/:id", async (req, res) => {

  let friendID = req.body.id;

  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$push: {friends: friendID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("INSERT_ERROR").status(500);  // Insertion failed for other reason
});


// Allows addition of new group (should pass user ID)
router.patch("/user/insert/group/:id", async (req, res) => {

  let groupID = req.body.id;

  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$push: {groups: groupID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("INSERT_ERROR").status(500);  // Insertion failed for other reason
});


// Allows removal of friend (should pass user ID)
router.patch("/user/pop/friend/:id", async (req, res) => {

  let friendID = req.body.id;

  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$pull: {friends: friendID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("POP_ERROR").status(500);  // Insertion failed for other reason
});


// Allows removal of group (should pass user ID)
router.patch("/user/pop/group/:id", async (req, res) => {

  let groupID = req.body.id;

  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$pull: {groups: groupID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("POP_ERROR").status(500);  // Insertion failed for other reason
});


// Allows deletion of a user
router.delete("/user/delete/:id", async (req, res) => {
  let collection = await db.collection("users");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.deleteOne(query);

  if(result) res.send("SUCCESS").status(200)
  else res.send("DELETE_ERROR").status(500); // Deletion failed
});


// ================================================== GROUP DOCUMENT FUNCTIONS =====================================================


// List all group records
router.get('/group', async (req, res) => {
  let collection = await db.collection("groups");
  let results = await collection.find({}).toArray();

  console.log(results);
  res.send(results).status(200);
});


// Allows you to fetch a group based on its id
router.get("/group/:id", async (req, res) => {
  let collection = await db.collection("groups");
  let query = {_id: new ObjectId(req.params.id)};
  let projection = {_id: 1};
  let result = await collection.findOne(query, projection);

  if (result) res.send(result).status(200);
  else res.send("FETCH_ERROR").status(404);  // Not found
});


// Allows creation of a new group
router.post("/group/create", async (req, res) => {

  let newGroup = {
    name: req.body.name,
    members: req.body.members,  // list of _id (users)
    transactions: req.body.transactions  // list of _id (transactions)
  };

  if(Object.values(newGroup).includes(undefined)){
    res.send("KEY_ERROR").status(400);  // Keys not provided proper values
    return;
  }

  let collection = await db.collection("groups");
  let result = await collection.insertOne(newGroup);

  if(result) res.send(result.insertedId).status(201);
  else res.send("CREATE_ERROR").status(500);  // Insertion failed for other reason
});


// Allows insertion of new member into group (should pass user ID)
router.patch("/group/insert/user/:id", async (req, res) => {

  let userID = req.body.id;

  let collection = await db.collection("groups");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$push: {members: userID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("INSERT_ERROR").status(500);  // Insertion failed for other reason
});


// Allows insertion of new transaction into group (should pass transaction ID)
router.patch("/group/insert/transaction/:id", async (req, res) => {

  let transactionID = req.body.id;

  let collection = await db.collection("groups");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$push: {transactions: transactionID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("INSERT_ERROR").status(500);  // Removal failed for other reason
});


// Allows removal of member from group (should pass user ID)
router.patch("/group/pop/user/:id", async (req, res) => {

  let userID = req.body.id;

  let collection = await db.collection("groups");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$pull: {members: userID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result.acknowledged) res.send("SUCCESS").status(201);
  else res.send("POP_ERROR").status(500);  // Removal failed for other reason
});


// Allows removal of transaction from group (should pass transaction ID)
router.patch("/group/pop/transaction/:id", async (req, res) => {

  let transactionID = req.body.id;

  let collection = await db.collection("groups");
  let query = {_id: new ObjectId(req.params.id)};
  let arrayAction = {$pull: {transactions: transactionID}};
  let result = await collection.updateOne(query, arrayAction);

  if(result) res.send("SUCCESS").status(201);
  else res.send("POP_ERROR").status(500);  // Insertion failed for other reason
});


// Allows deletion of a group
router.delete("/group/delete/:id", async (req, res) => {
  let collection = await db.collection("groups");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.deleteOne(query);

  if(result) res.send("SUCCESS").status(200)
  else res.send("DELETE_ERROR").status(500); // Deletion failed
});


// ================================================ TRANSACTION DOCUMENT FUNCTIONS =================================================


// List all transaction records
router.get('/transaction', async (req, res) => {
  let collection = await db.collection("transactions");
  let results = await collection.find({}).toArray();

  console.log(results);
  res.send(results).status(200);
});


// Allows you to fetch a transaction based on its ID
router.get("/transaction/:id", async (req, res) => {
  let collection = await db.collection("transactions");
  let query = {_id: new ObjectId(req.params.id)};
  let projection = {_id: 1};
  let result = await collection.findOne(query, projection);

  if (!result) res.send("FETCH_ERROR").status(404);  // Not found
  else res.send(result).status(200);
});


// Allows creation of a  transaction
router.post("/transaction/create", async (req, res) => {

  let newTransaction = {
    name: req.body.name,
    loaner: req.body.loaner,  // _id
    borrower: req.body.borrower,  // _id
    amount: req.body.amount  // double
  };

  if(Object.values(newTransaction).includes(undefined)){
    res.send("KEY_ERROR").status(400);  // Keys not provided proper values
    return;
  }

  let collection = await db.collection("transactions");
  let result = await collection.insertOne(newTransaction);

  if(result) res.send(result.insertedId).status(204);
  else res.send("CREATE_ERROR").status(500);  // Insertion failed for other reason
});


// Allows update of transaction amount
router.patch("/transaction/update/:id", async (req, res) => {

  let updatedAmount = req.body.amount;

  let collection = await db.collection("transactions");
  let query = {_id: new ObjectId(req.params.id)};
  let updateAction = {$set: {amount: updatedAmount}};
  let result = await updateOne(query, updateAction)
  
  if(result) res.send("SUCCESS").status(204);
  else res.send("UPDATE_ERROR").status(500);  // Update failed for other reason
});


// Allows deletion of a transaction
router.delete("/transaction/delete/:id", async (req, res) => {
  let collection = await db.collection("transactions");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.deleteOne(query);

  if(result) res.send("SUCCESS").status(200)
  else res.send("DELETE_ERROR").status(500); // Deletion failed
});

export default router;