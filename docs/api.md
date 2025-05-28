# API Documentation

## Overview

The AI Marketing Copy Generator provides a simple REST API for generating marketing content. This document outlines the available endpoints, request/response formats, and usage examples.

## AI21 Integration

The application uses AI21's Jurassic-2 Large language model for generating high-quality marketing copy. The integration is configured with the following parameters:

```json
{
    "temperature": 0.7,    // Controls creativity vs consistency
    "maxTokens": 500,      // Maximum length of generated content
    "topP": 0.9,          // Nucleus sampling parameter
    "stopSequences": ["\n\n", "###"]  // Sequence markers to stop generation
}
```

### AI21 API Requirements

- An AI21 API key is required (set in `.env` file as `AI21_API_KEY`)
- API Base URL: `https://api.ai21.com/studio/v1/j2-large/complete`
- Rate Limit: 60 requests per minute
- Pricing: Based on AI21's token usage pricing (see [AI21 pricing](https://www.ai21.com/pricing))

## Base URLs

```
Local Development: http://localhost:3001/api
AI21 Endpoint: https://api.ai21.com/studio/v1/j2-large/complete
```

## Endpoints

### Generate Marketing Copy

```http
POST /generate
```

Generates marketing copy based on the provided prompt and parameters.

#### Request Body

```json
{
    "prompt": "string",
    "tone": number,
    "template": string
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| prompt | string | The marketing brief or description |
| tone | number | Tone value between 0-100 (casual to formal) |
| template | string | Template ID (optional) |

#### Response

```json
{
    "content": "string",
    "stats": {
        "tokens": number,
        "time": number,
        "cost": number
    }
}
```

#### Example

```javascript
fetch('/api/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        prompt: "Write a product launch email for our new AI smartwatch",
        tone: 70,
        template: "product-launch"
    })
});
```

### Get Templates

```http
GET /templates
```

Returns available marketing copy templates.

#### Response

```json
{
    "templates": [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "defaultTone": number
        }
    ]
}
```

### Get Usage Statistics

```http
GET /stats
```

Returns usage statistics for the current session.

#### Response

```json
{
    "totalTokens": number,
    "totalCost": number,
    "totalRequests": number
}
```

## Error Handling

The API uses standard HTTP response codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized (Invalid AI21 API key)
- 429: Too Many Requests (AI21 rate limit exceeded)
- 500: Server Error

Error responses include a message:

```json
{
    "error": "string",
    "message": "string"
}
```

### AI21-Specific Errors

The following errors may occur specifically from the AI21 API:

- 401: Invalid API key or authentication failure
- 429: Rate limit exceeded (60 requests/minute)
- 400: Invalid request parameters (e.g., invalid temperature value)
- 500: AI21 service error

AI21 error response format:

```json
{
    "error": {
        "type": "string",
        "message": "string",
        "code": "string"
    }
}
```

## Rate Limiting

- Local API: 60 requests per minute per IP
- AI21 API: 60 requests per minute per API key
- Exceeded limits return 429 status code

## Best Practices

1. Include specific context in prompts
2. Use appropriate tone values
3. Handle errors gracefully
4. Implement retry logic
5. Cache responses when possible

## Examples

### Generating a Social Media Post

```javascript
const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        prompt: "Create a LinkedIn post about our AI marketing tool",
        tone: 60,
        template: "social-media"
    })
});

const data = await response.json();
console.log(data.content);
```

### Error Handling Example

```javascript
try {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: "Create marketing copy",
            tone: 50
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error('Error:', error);
}
``` 