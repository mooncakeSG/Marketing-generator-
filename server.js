require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate copy endpoint
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, tone } = req.body;
        
        // Check if API key is configured
        if (!process.env.AI21_API_KEY) {
            throw new Error('AI21 API key not configured. Please set the AI21_API_KEY environment variable.');
        }
        
        // Construct the system prompt based on tone
        let toneInstruction = '';
        if (tone < 33) {
            toneInstruction = 'Use a casual, friendly, and conversational tone.';
        } else if (tone < 66) {
            toneInstruction = 'Use a balanced, professional, and clear tone.';
        } else {
            toneInstruction = 'Use a formal, sophisticated, and business-appropriate tone.';
        }

        const systemPrompt = `You are a professional marketing copywriter. ${toneInstruction} Create compelling marketing copy based on the following brief:`;
        
        // Call AI21 API with updated endpoint and parameters
        const response = await axios.post('https://api.ai21.com/studio/v1/chat/completions', {
            model: 'jamba-large-1.6',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            n: 1,
            response_format: { type: 'text' }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.AI21_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Handle the updated response format
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const generatedText = response.data.choices[0].message.content.trim();
            res.json({
                success: true,
                text: generatedText
            });
        } else {
            throw new Error('Invalid response format from AI21');
        }
    } catch (error) {
        console.error('Generation error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to generate copy',
            details: error.response?.data?.detail || error.message
        });
    }
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Perform any necessary cleanup here
    process.exit(1);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 