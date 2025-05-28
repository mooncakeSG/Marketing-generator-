// Usage statistics module

// Track generation time
let generationStartTime = 0;

// Start timing
function startTiming() {
    generationStartTime = performance.now();
}

// End timing and return duration
function endTiming() {
    if (!generationStartTime) return 0;
    const duration = performance.now() - generationStartTime;
    generationStartTime = 0;
    return Math.round(duration);
}

// Calculate token usage from AI21 response
function calculateTokenUsage(response) {
    if (!response || !response.usage) {
        return {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
        };
    }

    return {
        promptTokens: response.usage.prompt_tokens || 0,
        completionTokens: response.usage.completion_tokens || 0,
        totalTokens: response.usage.total_tokens || 0
    };
}

// Format token count
function formatTokenCount(count) {
    return count.toLocaleString();
}

// Calculate estimated cost (based on AI21's pricing)
function calculateCost(tokenUsage) {
    const COST_PER_1K_TOKENS = 0.01; // Update this based on actual AI21 pricing
    return (tokenUsage.totalTokens / 1000) * COST_PER_1K_TOKENS;
}

// Format cost
function formatCost(cost) {
    return `$${cost.toFixed(4)}`;
}

// Update stats display
function updateStatsDisplay(stats) {
    const statsContainer = document.getElementById('generationStats');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.duration}ms</div>
                <div class="stat-label">Generation Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatTokenCount(stats.tokens.totalTokens)}</div>
                <div class="stat-label">Total Tokens</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${formatCost(stats.cost)}</div>
                <div class="stat-label">Estimated Cost</div>
            </div>
        </div>
    `;
}

// Get complete stats
function getGenerationStats(response) {
    const duration = endTiming();
    const tokens = calculateTokenUsage(response);
    const cost = calculateCost(tokens);

    return {
        duration,
        tokens,
        cost
    };
}

// Update monthly usage stats
async function updateUsageStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        // Update UI elements
        document.getElementById('totalTokens').textContent = formatTokenCount(stats.totalTokens);
        document.getElementById('totalCost').textContent = formatCost(stats.totalCost);
        document.getElementById('totalRequests').textContent = stats.totalRequests;
    } catch (error) {
        console.error('Failed to update usage stats:', error);
    }
}

// Mock data for development
let mockStats = {
    totalTokens: 0,
    totalCost: 0,
    totalRequests: 0
};

// Timing utilities
let startTime = 0;

export function startTiming() {
    startTime = Date.now();
}

export function endTiming() {
    return Date.now() - startTime;
}

// Token calculation (mock implementation)
export function calculateTokenUsage(text) {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

// Update stats display
export function updateStatsDisplay(stats) {
    document.getElementById('totalTokens').textContent = stats.tokens.toLocaleString();
    document.getElementById('totalCost').textContent = `$${stats.cost.toFixed(2)}`;
    document.getElementById('totalRequests').textContent = stats.requests.toLocaleString();
}

// Get generation statistics
export function getGenerationStats(response) {
    const tokens = calculateTokenUsage(response.choices[0].message.content);
    const cost = tokens * 0.000002; // Mock cost calculation
    
    // Update mock stats
    mockStats.totalTokens += tokens;
    mockStats.totalCost += cost;
    mockStats.totalRequests += 1;
    
    return {
        tokens,
        cost,
        requests: 1
    };
}

// Update usage statistics
export async function updateUsageStats() {
    try {
        // For development, use mock data instead of API call
        updateStatsDisplay({
            tokens: mockStats.totalTokens,
            cost: mockStats.totalCost,
            requests: mockStats.totalRequests
        });
    } catch (err) {
        console.error('Failed to update usage stats:', err);
        // Don't throw error to prevent blocking UI
    }
}

// Export functions
export {
    startTiming,
    endTiming,
    calculateTokenUsage,
    calculateCost,
    updateStatsDisplay,
    getGenerationStats,
    updateUsageStats
}; 