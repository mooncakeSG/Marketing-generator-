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

// Export functions
export {
    startTiming,
    endTiming,
    calculateTokenUsage,
    calculateCost,
    updateStatsDisplay,
    getGenerationStats
}; 