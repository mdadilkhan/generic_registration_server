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

exports.genricIntrestedRegistration = async (event) => {
  try {
    const data = event.body;

    // Validate input data
    if (!data.email || !data.name || !data.phone_number || !data.course || !data.year || !data.college_university_name) {
      return apiResponseBody(400, false, "Missing required fields");
    }

    // Set up the interested fields with default values if not provided
    const interestFields = {
      psychology_career_assessment: data.psychology_career_assessment || 0,
      psychology_career_bootcamp: data.psychology_career_bootcamp || 0,
      internships_and_trainings: data.internships_and_trainings || 0,
      mentorship: data.mentorship || 0,
      counselling_therapy: data.counselling_therapy || 0,
    };

    // Prepare the complete data object for storage
    const registrationData = {
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
      course: data.course,
      year: data.year,
      college_university_name: data.college_university_name,
      interested: interestFields,
    };

    // Get the collection reference
    const collection = await getCollectionRef("genricRegistration");

    // Check if email is already registered
    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
      return apiResponseBody(400, false, "Email already registered");
    }

    // Insert the data into the collection
    const result = await collection.insertOne(registrationData);

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
  
