import requests

# Configuration
AI21_API_KEY = "e9b9875e-b832-45c1-b6c2-7794829fcc5f"
AI21_API_URL = "https://api.ai21.com/studio/v1/j2-ultra/complete"

# Headers
headers = {
    "Authorization": f"Bearer {AI21_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

# Test payload with proper AI21 parameters
data = {
    "prompt": "Write a short marketing copy for wireless headphones.",
    "numResults": 1,
    "maxTokens": 100,
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

# Make request
print("Sending test request to AI21 API...")
try:
    response = requests.post(AI21_API_URL, headers=headers, json=data)
    print(f"\nStatus code: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print(f"Response: {response.text}")

    if response.status_code == 200:
        print("\nAPI connection successful!")
    elif response.status_code == 401:
        print("\nAuthentication failed! Please check your API key.")
    elif response.status_code == 403:
        print("\nPermission denied! Please make sure your API key has the correct permissions.")
    else:
        print("\nAPI connection failed!")
except Exception as e:
    print(f"\nError occurred: {str(e)}")