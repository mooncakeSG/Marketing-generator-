// Template definitions
const templates = {
    'product-launch': {
        name: 'Product Launch',
        prompt: 'Write a compelling product launch announcement for [Product Name]. Include key features, benefits, and a strong call to action. Target audience: [Target Audience]. Key selling points: [Key Points].',
        tone: 75
    },
    'social-media': {
        name: 'Social Media Teaser',
        prompt: 'Create engaging social media copy for [Product/Service]. Include hashtags, emojis, and a hook that drives engagement. Platform: [Platform]. Goal: [Marketing Goal].',
        tone: 40
    },
    'email-campaign': {
        name: 'Email Campaign',
        prompt: 'Write an email marketing campaign for [Product/Service]. Include subject line, preview text, and body copy. Focus on [Key Benefit] and include a clear call to action.',
        tone: 60
    },
    'product-comparison': {
        name: 'Product Comparison',
        prompt: 'Create a marketing comparison between [Product] and its competitors. Highlight unique selling points, advantages, and why customers should choose our product. Key differentiators: [Differentiators].',
        tone: 70
    },
    'brand-storytelling': {
        name: 'Brand Storytelling',
        prompt: 'Tell the story of [Brand/Company]. Include the origin, mission, values, and vision. Focus on emotional connection and authenticity. Key message: [Key Message].',
        tone: 65
    }
};

// Get template options for dropdown
export function getTemplateOptions() {
    return Object.entries(templates).map(([id, template]) => ({
        id,
        name: template.name
    }));
}

// Get specific template by ID
export function getTemplate(templateId) {
    return templates[templateId];
}

// Export templates object for reference
export const templateList = templates; 