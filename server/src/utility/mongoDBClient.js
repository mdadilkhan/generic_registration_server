const {MongoClient} = require('mongodb');
const env=require('dotenv')
env.config();
const mongoURL = process.env.DATABASE
console.log("mongoURL",mongoURL)

const dbName = process.env.DB_NAME
console.log("dbName",dbName);
console.log("process.env.environment",process.env.environment);

let dbClient = null;
const collectionNameRef = {};

exports.connectDB = async () => {
    const collectionsName = ['users','notifications','genricRegistration']
    try{
        if(dbClient){
            console.log("db is there")
            return;
        }

        const client = await MongoClient.connect(mongoURL, {minPoolSize: 10});
        dbClient = client.db(dbName);

        const collections = await dbClient.listCollections().toArray();
        const existingCollectionsName = collections && collections.length > 0 && collections.map((eachCollection) => eachCollection.name) || []
        for(const collection of collectionsName){
              if(!existingCollectionsName.includes(collection)){
                await dbClient.createCollection(collection);
                await dbClient.collection(collection).createIndex({'userId': 1})
              }
              collectionNameRef[collection] = dbClient.collection(collection)
        }
    }
    catch(err){
        console.log("isnde error>>");
        console.log(err);
    }
} 

exports.getCollectionRef = (collectionName) => {
    return collectionNameRef[collectionName]
} 