const {connectDB} =require('./src/utility/mongoDBClient.js')
const {apiResponseBody} =require('./src/utility/apiResponseBody.js')
const {routes}=require('./src/routes/routes.js')

const csv = require('csv-parser');
const stream = require('stream');


exports.handler = async (event, context) => {
    console.log("event>>>",event);
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    if(event.httpMethod === 'OPTIONS'){
        return apiResponseBody(200, 'success')
    }
    
    if (event.headers['Content-Type'] && event.headers['Content-Type'].includes('multipart/form-data')) {
        // console.log("inside parsing formData>>");
        event.body = await parseFormData(event);
        // console.log("isnde id of multipart",event.body);
    } else {
        // Parse the request body as JSON
        // console.log("Parse the request body as JSON>>");
        event.body = parseRequestBody(event);
    }

    // console.log("after parsing",event);
    const {httpMethod , path} = event;
    const route = routes[path];
    // console.log("route",route)

    if(!route?.[httpMethod]){
        return apiResponseBody(404, 'Not found');
    }

    const processHandler = route[httpMethod];
    return await processHandler(event);
}




const parseFormData = async (event) => {
    const body = event.body;

    // Extract the CSV data from the body
    const csvData = extractCSVData(body);

    // Create a readable stream from the CSV data
    const readable = new stream.Readable();
    readable.push(csvData);
    readable.push(null);

    // Parse the CSV data
    const jsonData = await parseCSV(readable);

    // console.log('Parsed CSV data:', jsonData);

    return jsonData; // Return the parsed JSON data
};

const extractCSVData = (body) => {
    // Find the start and end index of the CSV data
    const start = body.indexOf('\r\n\r\n') + 4; // Add 4 to skip the CRLF pair
    const end = body.lastIndexOf('\r\n') - 2; // Subtract 2 to exclude the final CRLF

    // Extract the CSV data
    const csvData = body.substring(start, end);

    return csvData;
};

const parseCSV = (readable) => {
    return new Promise((resolve, reject) => {
        const jsonData = [];

        // Parse CSV
        readable
            .pipe(csv())
            .on('data', (data) => {
                jsonData.push(data);
            })
            .on('end', () => {
                resolve(jsonData);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};



const parseRequestBody = (event) => {
    // Check if the body is already parsed or not
    if (typeof event.body === 'object') {
        return event.body;
    }

    try {
        // Parse the JSON body if it's a string
        return JSON.parse(event.body || '{}');
    } catch (error) {
        // If parsing fails, return an empty object
        console.error('Error parsing request body:', error);
        return {};
    }
}

