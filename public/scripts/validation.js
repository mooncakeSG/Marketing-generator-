// Input validation module

// Validate prompt input
export function validatePrompt(prompt) {
    if (!prompt || !prompt.trim()) {
        throw new Error('Please enter a prompt');
    }

    // Get effective length excluding placeholders
    const effectiveLength = prompt.replace(/\[.*?\]/g, '').trim().length;

    // Check minimum length - more lenient if contains placeholders
    if (effectiveLength < 10 && !prompt.includes('[')) {
        throw new Error('Prompt is too short. Please provide more details.');
    }

    // Check maximum length
    if (prompt.trim().length > 1000) {
        throw new Error('Prompt is too long. Please keep it under 1000 characters.');
    }

    return prompt.trim();
}

// Validate tone value
export function validateTone(tone) {
    const toneValue = parseInt(tone);
    if (isNaN(toneValue) || toneValue < 0 || toneValue > 100) {
        throw new Error('Invalid tone value. Please use a value between 0 and 100.');
    }
    return toneValue;
}

// Validate API response
export function validateResponse(response) {
    if (!response) {
        throw new Error('No response received from the server');
    }

    if (response.error) {
        throw new Error(response.error.message || 'Server error occurred');
    }

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
        throw new Error('Invalid response format from server');
    }

    return response;
}

// Filter inappropriate content
export function filterContent(content) {
    if (!content) return '';

    // List of inappropriate words/phrases to filter
    const inappropriateWords = [
        'profanity',
        'offensive',
        'inappropriate',
        // Add more words as needed
    ];

    let filteredContent = content;
    inappropriateWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        filteredContent = filteredContent.replace(regex, '[filtered]');
    });

    return filteredContent;
}

// Quality check for generated content
export function qualityCheck(content) {
    if (!content || typeof content !== 'string') {
        return false;
    }

    // Minimum length check
    if (content.length < 50) {
        throw new Error('Generated content is too short');
    }

    // Maximum length check
    if (content.length > 5000) {
        throw new Error('Generated content exceeds maximum length');
    }

    // Check for coherence (basic)
    if (!content.includes('.') || !content.includes(' ')) {
        throw new Error('Generated content lacks proper structure');
    }

    // Check for repetition
    const sentences = content.split('.');
    const uniqueSentences = new Set(sentences.map(s => s.trim()));
    if (uniqueSentences.size < sentences.length * 0.8) {
        throw new Error('Generated content contains too much repetition');
    }

    return true;
} 