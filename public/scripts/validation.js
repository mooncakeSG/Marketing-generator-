// Input validation and output filtering module

// Banned words list (basic example - expand as needed)
const BANNED_WORDS = [
    'damn', 'hell', 'crap', 'sex', 'kill',
    // Add more words as needed
];

// Input validation configuration
const INPUT_CONFIG = {
    minLength: 10,
    maxLength: 1000,
    allowedPattern: /^[\w\s.,!?'"()-]+$/,
};

// Validation result type
class ValidationResult {
    constructor(isValid, message = '') {
        this.isValid = isValid;
        this.message = message;
    }
}

// Validation constants
const MIN_LENGTH = 10;
const SPECIAL_CHARS_REGEX = /[<>\[\]{}]/;
// Optional: Basic inappropriate content filter
const INAPPROPRIATE_WORDS = [
    // Add inappropriate words here
    // Example: 'badword1', 'badword2', etc.
];

// Validate prompt input
export function validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return {
            isValid: false,
            message: 'Please enter your marketing brief'
        };
    }

    // Check minimum length
    if (prompt.length < MIN_LENGTH) {
        return {
            isValid: false,
            message: `Input must be at least ${MIN_LENGTH} characters long`
        };
    }

    // Check for special characters
    if (SPECIAL_CHARS_REGEX.test(prompt)) {
        return {
            isValid: false,
            message: 'Input cannot contain brackets or special characters (<, >, [, ], {, })'
        };
    }

    // Optional: Check for inappropriate content
    const containsInappropriateContent = INAPPROPRIATE_WORDS.some(word => 
        prompt.toLowerCase().includes(word.toLowerCase())
    );
    
    if (containsInappropriateContent) {
        return {
            isValid: false,
            message: 'Please ensure your content is appropriate and professional'
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

// Validate tone value
export function validateTone(tone) {
    const toneValue = parseInt(tone);
    if (isNaN(toneValue) || toneValue < 0 || toneValue > 100) {
        return new ValidationResult(false, 'Invalid tone value');
    }
    return new ValidationResult(true, '');
}

// Filter and clean output content
export function filterContent(content) {
    if (!content) return '';

    let filteredContent = content;

    // Remove any banned words
    BANNED_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filteredContent = filteredContent.replace(regex, '[removed]');
    });

    // Remove repetitive sentences
    filteredContent = removeRepetitiveSentences(filteredContent);

    // Clean up excessive whitespace
    filteredContent = filteredContent
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .trim();

    return filteredContent;
}

// Helper function to remove repetitive sentences
function removeRepetitiveSentences(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const uniqueSentences = new Set();
    const filteredSentences = sentences.filter(sentence => {
        const normalized = sentence.trim().toLowerCase();
        if (uniqueSentences.has(normalized)) {
            return false;
        }
        uniqueSentences.add(normalized);
        return true;
    });
    return filteredSentences.join(' ');
}

// Validate API response
export function validateResponse(response) {
    if (!response) {
        throw new Error('No response received from the API');
    }

    if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        throw new Error('Invalid response format from API');
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
        throw new Error('No content in API response');
    }

    return new ValidationResult(true, '');
}

// Quality check for generated content
export function qualityCheck(content) {
    if (!content || typeof content !== 'string') {
        return false;
    }

    // Check minimum content length
    if (content.length < 50) {
        return false;
    }

    // Check for coherent sentence structure (basic check)
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 2) {
        return false;
    }

    // Check for excessive repetition
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFrequency = {};
    words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const maxRepetition = Math.ceil(words.length * 0.1); // Allow up to 10% repetition
    const hasExcessiveRepetition = Object.values(wordFrequency).some(count => count > maxRepetition);

    if (hasExcessiveRepetition) {
        return false;
    }

    return true;
}

// Export validation utilities
export const utils = {
    BANNED_WORDS,
    INPUT_CONFIG,
    ValidationResult
}; 