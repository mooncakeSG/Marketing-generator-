from flask import Flask, render_template, request, jsonify, make_response
import requests
import os
from dotenv import load_dotenv
import time
from datetime import datetime, timedelta

# Load environment variables
load_dotenv('example.env')

app = Flask(__name__)

# Configuration
AI21_API_KEY = "e9b9875e-b832-45c1-b6c2-7794829fcc5f"
AI21_API_URL = "https://api.ai21.com/studio/v1/j2-ultra/complete"

def add_cache_headers(response, cache_timeout=300):  # 5 minutes default
    response.headers['Cache-Control'] = f'public, max-age={cache_timeout}'
    response.headers['Expires'] = (datetime.utcnow() + timedelta(seconds=cache_timeout)).strftime('%a, %d %b %Y %H:%M:%S GMT')
    return response

@app.after_request
def add_security_headers(response):
    # Add security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response

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
        response = requests.post(AI21_API_URL, headers=headers, json=data, timeout=30)
        generation_time = time.time() - start_time
        
        if response.status_code != 200:
            print(f"API Error: {response.text}")
            return None, generation_time
            
        result = response.json()
        
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
    response = make_response(render_template('index.html'))
    return add_cache_headers(response, cache_timeout=3600)  # Cache for 1 hour

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
            response = jsonify({
                'success': True, 
                'copy': copy,
                'generation_time': round(generation_time, 2)
            })
            # Don't cache API responses
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            return response
        else:
            return jsonify({'success': False, 'error': 'Failed to generate copy. Check the console for details.'})

    except Exception as e:
        print(f"Error in generate route: {str(e)}")
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)