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

// Add validation for API key
if (!AI21_API_KEY) {
    console.error('AI21_API_KEY is not set in environment variables');
    process.exit(1);
}

// Test the AI21 connection on startup
async function testAI21Connection() {
    try {
        const response = await axios({
            method: 'post',
            url: AI21_API_URL,
            headers: {
                'Authorization': `Bearer ${AI21_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                model: "jamba-large-1.6",
                messages: [
                    {
                        role: "user",
                        content: "Test connection"
                    }
                ],
                max_tokens: 1
            }
        });
        console.log('AI21 API connection test successful');
        return true;
    } catch (error) {
        console.error('AI21 API connection test failed:', error.response?.data || error.message);
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

        const enhancedPrompt = `Generate marketing copy in a ${toneDescription} tone. ${prompt}`;

        const data = {
            model: "jamba-large-1.6",  // Using jamba-large-1.6 for better marketing copy
            messages: [
                {
                    role: "system",
                    content: "You are a professional marketing copywriter skilled in creating compelling and persuasive content."
                },
                {
                    role: "user",
                    content: enhancedPrompt
                }
            ],
            temperature: 0.7,
            maxTokens: 500
        };

        console.log('Sending request to AI21 with data:', data);
        const response = await axios({
            method: 'post',
            url: AI21_API_URL,
            headers: {
                'Authorization': `Bearer ${AI21_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: data
        });

        console.log('Received response from AI21:', response.data);
        
        if (!response.data || !response.data.completions || !response.data.completions[0]) {
            throw new Error('Invalid response from AI21');
        }

        // Format the response to match what the frontend expects
        const formattedResponse = {
            choices: [{
                message: {
                    content: response.data.completions[0].text.trim()
                }
            }]
        };

        console.log('Sending formatted response to frontend:', formattedResponse);
        
        if (!formattedResponse.choices[0].message.content) {
            throw new Error('No content received from AI21');
        }
        
        res.json(formattedResponse);
    } catch (error) {
        console.error('Error in /api/generate:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to generate marketing copy',
            details: error.message
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
