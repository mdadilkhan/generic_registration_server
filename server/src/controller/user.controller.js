const { getCollectionRef } = require('../utility/mongoDBClient.js')
const { apiResponseBody } = require('../utility/apiResponseBody.js')


const dotenv = require("dotenv");
dotenv.config()





exports.registration = async (event) => {
  try {
    // Ensure that event.body is parsed if it is a string
    const data = event.body;
    
    // Validate input data (optional, but recommended)
    if (!data.email || !data.fullName) {
      return apiResponseBody(400, false, "Missing required fields");
    }

    // Get the collection reference
    const collection = await getCollectionRef("genricRegistration");

    // Check if email is already registered
    const existingUser = await collection.findOne({ email: data.email });

    if (existingUser) {
      // If email is already registered, return error response
      return apiResponseBody(400, false, "Email already registered");
    }

    // Insert the data into the collection
    const result = await collection.insertOne(data);

    // Check the result and respond accordingly
    if (result.acknowledged) {
      console.log("Data successfully added");
      return apiResponseBody(200, true, "Data successfully added");
    } else {
      console.log("Failed in adding data");
      return apiResponseBody(500, false, "Failed in adding data");
    }
  } catch (error) {
    console.error("Error during saving details:", error);
    return apiResponseBody(500, false, "Internal Server Error");
  }
};
  
