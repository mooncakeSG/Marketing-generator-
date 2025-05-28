// Marketing copy templates
const templates = {
    'product-launch': {
        name: 'Product Launch',
        template: `Write a compelling product launch announcement for [product name]. Focus on:
- Unique value proposition
- Key features and benefits
- Target audience pain points
- Launch timing and availability
- Call to action
Tone: Professional and exciting`,
        placeholders: ['[product name]']
    },
    'social-media': {
        name: 'Social Media Teaser',
        template: `Create an engaging social media post for [product/service] that:
- Hooks attention in first line
- Uses conversational language
- Includes relevant hashtags
- Drives engagement
- Fits platform character limits
Length: 280 characters max`,
        placeholders: ['[product/service]']
    },
    'email-campaign': {
        name: 'Email Campaign',
        template: `Design an email marketing campaign for [product/service] including:
- Attention-grabbing subject line
- Personalized greeting
- Value proposition
- Social proof elements
- Clear CTA
- Urgency drivers
Format: HTML-safe`,
        placeholders: ['[product/service]']
    },
    'product-comparison': {
        name: 'Product Comparison',
        template: `Create a balanced comparison between [product] and its competitors:
- Key differentiators
- Feature comparison
- Price-value proposition
- Target audience fit
- Competitive advantages
Style: Objective and data-driven`,
        placeholders: ['[product]']
    },
    'brand-storytelling': {
        name: 'Brand Storytelling',
        template: `Craft a compelling brand story for [company name] highlighting:
- Origin and mission
- Core values
- Customer impact
- Vision for future
- Emotional connection
Style: Narrative and authentic`,
        placeholders: ['[company name]']
    }
};

// Get template by ID
function getTemplate(templateId) {
    return templates[templateId] || null;
}

// Get all template names for dropdown
function getTemplateOptions() {
    return Object.entries(templates).map(([id, template]) => ({
        id,
        name: template.name
    }));
}

// Load template into prompt field
function loadTemplate(templateId) {
    const template = getTemplate(templateId);
    if (!template) return null;
    
    const promptField = document.getElementById('prompt');
    if (promptField) {
        promptField.value = template.template;
        
        // Focus on first placeholder if exists
        if (template.placeholders && template.placeholders.length > 0) {
            const placeholder = template.placeholders[0];
            const start = template.template.indexOf(placeholder);
            if (start >= 0) {
                promptField.focus();
                promptField.setSelectionRange(start, start + placeholder.length);
            }
        }
    }
    return template;
}

// Export functions
export {
    getTemplate,
    getTemplateOptions,
    loadTemplate
}; 