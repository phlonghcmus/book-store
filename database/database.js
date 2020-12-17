const { MongoClient } = require("mongodb");

// Connection URI
const uri ="mongodb+srv://admin:181204391812044218120452@cluster0.4rak6.mongodb.net/test";

let database;
// Create a new MongoClient
const client = new MongoClient(process.env.MONGODB_URL,{ useUnifiedTopology: true });
async function run() {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
       database= await client.db("bookstore");
        console.log("Connected successfully to server");
}

run();

db=()=> database;

module.exports.db=db;