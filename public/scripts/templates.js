// Templates module

// Template definitions
const TEMPLATES = {
    'product-launch': {
        id: 'product-launch',
        name: 'Product Launch Announcement',
        prompt: 'Write a compelling product launch announcement for [Product Name]. Include key features, benefits, and a strong call to action. Target audience: [Target Audience]. Key selling points: [Key Points].',
        tone: 70
    },
    'social-media': {
        id: 'social-media',
        name: 'Social Media Post',
        prompt: 'Create an engaging social media post about [Topic]. Include hashtags and a call to action. Target platform: [Platform]. Key message: [Message].',
        tone: 40
    },
    'email-campaign': {
        id: 'email-campaign',
        name: 'Email Campaign',
        prompt: 'Write an email marketing campaign for [Product/Service]. Include subject line, body, and call to action. Target audience: [Audience]. Key benefits: [Benefits].',
        tone: 60
    },
    'blog-post': {
        id: 'blog-post',
        name: 'Blog Post',
        prompt: 'Write a blog post about [Topic]. Include introduction, main points, and conclusion. Target audience: [Audience]. Key takeaways: [Takeaways].',
        tone: 50
    },
    'press-release': {
        id: 'press-release',
        name: 'Press Release',
        prompt: 'Write a press release about [News/Announcement]. Include quotes, facts, and contact information. Key points: [Key Points].',
        tone: 80
    }
};

// Get template by ID
export function getTemplate(templateId) {
    if (!templateId) return null;
    return TEMPLATES[templateId] || null;
}

// Get all available templates
export function getTemplateOptions() {
    return Object.values(TEMPLATES);
}

// Validate template
export function validateTemplate(templateId) {
    if (!templateId) {
        throw new Error('Template ID is required');
    }
    
    const template = TEMPLATES[templateId];
    if (!template) {
        throw new Error('Invalid template ID');
    }
    
    return template;
}

// Process template with variables
export function processTemplate(template, variables) {
    if (!template || !template.prompt) {
        throw new Error('Invalid template');
    }
    
    let processedPrompt = template.prompt;
    
    // Replace variables in the format [Variable]
    if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = new RegExp(`\\[${key}\\]`, 'g');
            processedPrompt = processedPrompt.replace(placeholder, value);
        });
    }
    
    return {
        ...template,
        prompt: processedPrompt
    };
}

// Export template utilities
export const utils = {
    TEMPLATES
}; 