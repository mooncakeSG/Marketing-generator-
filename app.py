from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv('example.env')

app = Flask(__name__)

# Configuration
AI21_API_KEY = "e9b9875e-b832-45c1-b6c2-7794829fcc5f"
AI21_API_URL = "https://api.ai21.com/studio/v1/j2-ultra/complete"

def generate_marketing_copy(product_type, platform, tone, features, length):
    start_time = time.time()
    
    prompt = f"""Write a {length.lower()} marketing copy for a {product_type} to be posted on {platform} with a {tone.lower()} tone.
    The copy should highlight these key features: {features}
    
    Make it engaging, persuasive, and tailored to the platform's style.
    Include relevant emojis and hashtags if appropriate.
    Focus on benefits and unique selling points."""

    headers = {
        "Authorization": f"Bearer {AI21_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    data = {
        "prompt": prompt,
        "numResults": 1,
        "maxTokens": 200,
        "temperature": 0.7,
        "topP": 0.9,
        "frequencyPenalty": {
            "scale": 0.3,
            "applyToWhitespaces": True,
            "applyToPunctuations": True,
            "applyToNumbers": True,
            "applyToStopwords": True,
            "applyToEmojis": True
        },
        "presencePenalty": {
            "scale": 0.3,
            "applyToWhitespaces": True,
            "applyToPunctuations": True,
            "applyToNumbers": True,
            "applyToStopwords": True,
            "applyToEmojis": True
        }
    }

    try:
        print("Sending request to AI21 API...")
        response = requests.post(AI21_API_URL, headers=headers, json=data)
        print(f"Response status code: {response.status_code}")
        print(f"Response: {response.text}")
        
        generation_time = time.time() - start_time
        
        if response.status_code != 200:
            print(f"API Error: {response.text}")
            return None, generation_time
            
        result = response.json()
        print(f"API Response: {result}")
        
        if 'completions' in result and len(result['completions']) > 0:
            return result['completions'][0]['data']['text'], generation_time
        else:
            print(f"Unexpected API response format: {result}")
            return None, generation_time
            
    except Exception as e:
        print(f"Error calling AI21 API: {str(e)}")
        return None, time.time() - start_time

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        product_type = data.get('product_type')
        platform = data.get('platform')
        tone = data.get('tone')
        features = data.get('features')
        length = data.get('length')

        if not all([product_type, platform, tone, features, length]):
            return jsonify({'success': False, 'error': 'Missing required fields'})

        copy, generation_time = generate_marketing_copy(product_type, platform, tone, features, length)
        
        if copy:
            return jsonify({
                'success': True, 
                'copy': copy,
                'generation_time': round(generation_time, 2)
            })
        else:
            return jsonify({'success': False, 'error': 'Failed to generate copy. Check the console for details.'})

    except Exception as e:
        print(f"Error in generate route: {str(e)}")
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)