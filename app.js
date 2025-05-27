import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: 'example.env' });

const app = express();
const port = 3000;

// Configuration
const AI21_API_KEY = "e9b9875e-b832-45c1-b6c2-7794829fcc5f";
const AI21_API_URL = "https://api.ai21.com/studio/v1/j2-large-instruct/complete";

app.use(express.json());
app.use(express.static('public'));

async function generateMarketingCopy(productType, platform, tone, features, length) {
    const startTime = Date.now();
    
    const prompt = `Write a ${length.toLowerCase()} marketing copy for a ${productType} to be posted on ${platform} with a ${tone.toLowerCase()} tone.
    The copy should highlight these key features: ${features}
    
    Make it engaging, persuasive, and tailored to the platform's style.
    Include relevant emojis and hashtags if appropriate.
    Focus on benefits and unique selling points.`;

    const data = {
        prompt,
        numResults: 1,
        maxTokens: 200,
        temperature: 0.7,
        topP: 0.9,
        frequencyPenalty: {
            scale: 0.3,
            applyToWhitespaces: true,
            applyToPunctuations: true,
            applyToNumbers: true,
            applyToStopwords: true,
            applyToEmojis: true
        },
        presencePenalty: {
            scale: 0.3,
            applyToWhitespaces: true,
            applyToPunctuations: true,
            applyToNumbers: true,
            applyToStopwords: true,
            applyToEmojis: true
        }
    };

    try {
        console.log("Sending request to AI21 API...");
        const response = await fetch(AI21_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI21_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log(`Response status code: ${response.status}`);
        const result = await response.json();
        console.log(`API Response: ${JSON.stringify(result)}`);
        
        const generationTime = (Date.now() - startTime) / 1000;
        
        if (!response.ok) {
            console.log(`API Error: ${JSON.stringify(result)}`);
            return { copy: null, generationTime };
        }
        
        if (result.completions && result.completions.length > 0) {
            return { 
                copy: result.completions[0].data.text, 
                generationTime 
            };
        } else {
            console.log(`Unexpected API response format: ${JSON.stringify(result)}`);
            return { copy: null, generationTime };
        }
    } catch (error) {
        console.error(`Error calling AI21 API: ${error}`);
        return { 
            copy: null, 
            generationTime: (Date.now() - startTime) / 1000 
        };
    }
}

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.post('/generate', async (req, res) => {
    try {
        const { product_type, platform, tone, features, length } = req.body;

        if (!product_type || !platform || !tone || !features || !length) {
            return res.json({ success: false, error: 'Missing required fields' });
        }

        const { copy, generationTime } = await generateMarketingCopy(
            product_type, 
            platform, 
            tone, 
            features, 
            length
        );
        
        if (copy) {
            res.json({
                success: true,
                copy,
                generation_time: Math.round(generationTime * 100) / 100
            });
        } else {
            res.json({ 
                success: false, 
                error: 'Failed to generate copy. Check the console for details.' 
            });
        }
    } catch (error) {
        console.error(`Error in generate route: ${error}`);
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});