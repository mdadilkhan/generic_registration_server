const { headers }=require('../constant/header.js')
exports.apiResponseBody = (statusCode, success, data) => {
    return {
        statusCode,
        headers,
        body: JSON.stringify({success,data})
    }
}