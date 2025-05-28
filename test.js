const axios = require('axios');

// Configuration
const AI21_API_KEY = "2d121793-39d1-4ff0-8b30-94a06c50fb7f";
const AI21_API_URL = "https://api.ai21.com/studio/v1/chat/completions";

// Test payload for chat completions
const data = {
    model: "jamba-large-1.6",
    messages: [
        {
            role: "user",
            content: "Write a short marketing copy for wireless headphones."
        }
    ],
    documents: [],
    tools: [],
    n: 1,
    max_tokens: 2048,
    temperature: 0.4,
    top_p: 1,
    stop: [],
    response_format: { type: "text" }
};

// Make request
console.log("Sending test request to AI21 Chat API...");
axios({
    method: 'post',
    url: AI21_API_URL,
    headers: {
        'Authorization': `Bearer ${AI21_API_KEY}`,
        'Content-Type': 'application/json'
    },
    data: data
})
.then(response => {
    console.log("\nAPI Response:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("\nAPI connection successful!");
})
.catch(error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("\nAPI Error Response:");
        console.error(`Status: ${error.response.status}`);
        console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
        
        if (error.response.status === 401) {
            console.error("\nAuthentication failed! Please check your API key.");
        } else if (error.response.status === 403) {
            console.error("\nPermission denied! Please make sure your API key has the correct permissions.");
        }
    } else if (error.request) {
        // The request was made but no response was received
        console.error("\nNo response received from the API");
        console.error(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error("\nError setting up the request:");
        console.error(error.message);
    }
});