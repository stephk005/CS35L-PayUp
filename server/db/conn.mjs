import { MongoClient } from 'mongodb';


const connectionString = process.env.ATLAS_URI || '';

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
    console.log("Connected");
} catch (e) {
    console.log("Couldn't connect");
    console.error(e);
}


let db = conn.db("test_users");

export default db;