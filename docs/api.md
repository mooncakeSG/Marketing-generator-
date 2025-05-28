# API Documentation

## Overview

The AI Marketing Copy Generator provides a simple REST API for generating marketing content. This document outlines the available endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:3001/api
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
- 401: Unauthorized
- 429: Too Many Requests
- 500: Server Error

Error responses include a message:

```json
{
    "error": "string",
    "message": "string"
}
```

## Rate Limiting

- 60 requests per minute per IP
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