const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Exit the process on uncaught exceptions
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// AI21 Configuration
const AI21_API_KEY = process.env.AI21_API_KEY;
const AI21_API_URL = "https://api.ai21.com/studio/v1/chat/completions";

if (!AI21_API_KEY) {
    console.error('Error: AI21_API_KEY is not set in environment variables');
    process.exit(1); // Exit if API key is not set
}

const authHeader = AI21_API_KEY.startsWith('Bearer ') ? AI21_API_KEY : `Bearer ${AI21_API_KEY}`;

// Test the AI21 connection on startup
async function testAI21Connection() {
    try {
        const response = await axios({
            method: 'post',
            url: AI21_API_URL,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            data: {
                model: "jamba-large-1.6",
                messages: [{ role: "user", content: "test" }],
                documents: [],
                tools: [],
                n: 1,
                max_tokens: 2048,
                temperature: 0.4,
                top_p: 1,
                stop: [],
                response_format: { type: "text" }
            }
        });
        
        console.log('AI21 API connection test successful');
        return true;
    } catch (error) {
        if (error.response) {
            console.error('AI21 API connection test failed:', {
                status: error.response.status,
                data: error.response.data
            });
        } else {
            console.error('AI21 API connection test failed:', error.message);
        }
        return false;
    }
}

// API endpoint for generating marketing copy
app.post('/api/generate', async (req, res) => {
    try {
        console.log('Received generate request:', req.body);
        const { prompt, tone } = req.body;
        
        if (!prompt) {
            return res.status(400).json({
                error: 'No prompt provided'
            });
        }

        // Adjust the prompt based on tone
        let toneValue = parseInt(tone);
        let toneDescription = 'neutral';
        if (toneValue <= 32) toneDescription = 'casual and friendly';
        else if (toneValue > 66) toneDescription = 'formal and professional';

        const systemMessage = `You are a professional marketing copywriter. Generate ${toneDescription} marketing copy.`;
        
        const data = {
            model: "jamba-large-1.6",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt }
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

        console.log('Sending request to AI21 with data:', data);
        const response = await axios({
            method: 'post',
            url: AI21_API_URL,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            data: data,
            timeout: 30000 // 30 second timeout
        });

        console.log('Received response from AI21:', response.data);
        
        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            throw new Error('Invalid or empty response from AI21');
        }

        const generatedContent = response.data.choices[0].message?.content;
        
        if (!generatedContent) {
            throw new Error('No content received from AI21');
        }
        
        res.json({
            choices: [{
                message: {
                    content: generatedContent
                }
            }]
        });
    } catch (error) {
        console.error('Error in /api/generate:', error);
        
        // Determine the appropriate error message and status code
        let statusCode = 500;
        let errorMessage = 'Failed to generate marketing copy';
        
        if (error.response) {
            // API responded with an error
            statusCode = error.response.status;
            errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
            
            if (statusCode === 401 || statusCode === 403) {
                errorMessage = 'API authentication failed. Please check your API key.';
            } else if (statusCode === 429) {
                errorMessage = 'Rate limit exceeded. Please try again later.';
            }
        } else if (error.code === 'ECONNABORTED') {
            statusCode = 504;
            errorMessage = 'Request timed out. Please try again.';
        }
        
        res.status(statusCode).json({
            error: errorMessage,
            details: error.message,
            technical_details: error.response?.data || null
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
async function startServer() {
    try {
        // Test AI21 connection before starting the server
        const ai21Connected = await testAI21Connection();
        if (!ai21Connected) {
            console.warn('Warning: AI21 API connection test failed, but starting server anyway');
        }

        // Start listening
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log('Try accessing the following URLs to test the connection:');
            console.log(`- Health check: http://localhost:${port}/health`);
            console.log(`- Main page: http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server only once
startServer();
