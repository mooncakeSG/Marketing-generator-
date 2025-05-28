// Cache management
const templateCache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export function getCachedTemplate(templateId) {
    const cached = templateCache.get(templateId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

export function cacheTemplate(templateId, data) {
    templateCache.set(templateId, {
        data,
        timestamp: Date.now()
    });
}

// Debounce utility
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Rate limit tracking
const rateLimits = {
    generate: { count: 0, resetTime: Date.now(), limit: 60 },
    export: { count: 0, resetTime: Date.now(), limit: 30 }
};

export function checkRateLimit(action) {
    const now = Date.now();
    const limit = rateLimits[action];
    
    // Reset counter if a minute has passed
    if (now - limit.resetTime > 60000) {
        limit.count = 0;
        limit.resetTime = now;
    }
    
    // Check if limit reached
    if (limit.count >= limit.limit) {
        throw new Error(`Rate limit reached for ${action}. Please try again in ${Math.ceil((limit.resetTime + 60000 - now) / 1000)} seconds.`);
    }
    
    limit.count++;
    return true;
}

// Progressive loading states
export function updateLoadingProgress(message, progress) {
    const loading = document.getElementById('loading');
    if (!loading) return;
    
    const progressText = loading.querySelector('p');
    if (progressText) {
        progressText.textContent = message;
    }
    
    // Update progress bar if it exists
    const progressBar = loading.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
} 