// Input validation module

// Validate prompt input
function validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required');
    }

    if (prompt.trim().length < 10) {
        throw new Error('Prompt must be at least 10 characters long');
    }

    if (prompt.trim().length > 1000) {
        throw new Error('Prompt must not exceed 1000 characters');
    }

    // Check for placeholder text still present
    if (prompt.includes('[') && prompt.includes(']')) {
        throw new Error('Please replace all placeholder text in square brackets');
    }

    return prompt.trim();
}

// Validate tone value
function validateTone(tone) {
    const toneValue = parseInt(tone);
    
    if (isNaN(toneValue)) {
        throw new Error('Tone must be a number');
    }

    if (toneValue < 0 || toneValue > 100) {
        throw new Error('Tone must be between 0 and 100');
    }

    return toneValue;
}

// Validate API response
function validateResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new Error('Invalid API response format');
    }

    if (!response.choices || !Array.isArray(response.choices)) {
        throw new Error('Invalid API response structure');
    }

    if (!response.choices[0]?.message?.content) {
        throw new Error('No content in API response');
    }

    return true;
}

// Content filtering
function filterContent(content) {
    if (!content || typeof content !== 'string') {
        return '';
    }

    // Remove any HTML tags
    content = content.replace(/<[^>]*>/g, '');

    // List of inappropriate words/phrases to filter
    const inappropriatePatterns = [
        /profanity/i,
        /obscene/i,
        /offensive/i,
        // Add more patterns as needed
    ];

    // Replace inappropriate content with asterisks
    inappropriatePatterns.forEach(pattern => {
        content = content.replace(pattern, '***');
    });

    // Ensure the response is complete (ends with punctuation)
    if (!content.match(/[.!?]$/)) {
        content += '.';
    }

    return content.trim();
}

// Quality check
function qualityCheck(content) {
    if (!content || typeof content !== 'string') {
        return false;
    }

    // Minimum length check
    if (content.length < 50) {
        return false;
    }

    // Check for complete sentences
    if (!content.match(/[.!?]$/)) {
        return false;
    }

    // Check for balanced structure
    const paragraphs = content.split('\n\n');
    if (paragraphs.length < 2) {
        return false;
    }

    return true;
}

// Export functions
export {
    validatePrompt,
    validateTone,
    validateResponse,
    filterContent,
    qualityCheck
}; 