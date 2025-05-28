// Statistics tracking module

let startTime = 0;
let statsData = {
    generationTime: 0,
    totalTokens: 0,
    estimatedCost: 0,
    totalRequests: 0
};

// Start timing the generation process
export function startTiming() {
    startTime = performance.now();
}

// End timing and calculate duration
export function endTiming() {
    const endTime = performance.now();
    statsData.generationTime = ((endTime - startTime) / 1000).toFixed(2); // Convert to seconds
    return statsData.generationTime;
}

// Calculate token usage from API response
export function calculateTokenUsage(response) {
    if (!response || !response.usage) return 0;
    
    const promptTokens = response.usage.prompt_tokens || 0;
    const completionTokens = response.usage.completion_tokens || 0;
    statsData.totalTokens = promptTokens + completionTokens;
    
    // Calculate cost (using typical GPT-3.5-turbo pricing)
    const promptCost = (promptTokens * 0.0015) / 1000; // $0.0015 per 1K tokens
    const completionCost = (completionTokens * 0.002) / 1000; // $0.002 per 1K tokens
    statsData.estimatedCost = (promptCost + completionCost).toFixed(4);
    
    return statsData.totalTokens;
}

// Get current generation statistics
export function getGenerationStats() {
    return {
        generationTime: statsData.generationTime,
        totalTokens: statsData.totalTokens,
        estimatedCost: statsData.estimatedCost
    };
}

// Update the stats display in the UI
export function updateStatsDisplay(stats = statsData) {
    const statsContainer = document.getElementById('generationStats');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.generationTime}s</div>
                <div class="stat-label">Generation Time</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalTokens}</div>
                <div class="stat-label">Total Tokens</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">$${stats.estimatedCost}</div>
                <div class="stat-label">Estimated Cost</div>
            </div>
        </div>
    `;
}

// Update monthly usage statistics
export async function updateUsageStats() {
    try {
        statsData.totalRequests++;
        
        // Update the monthly stats display
        const monthlyStatsContainer = document.getElementById('usageStats');
        if (monthlyStatsContainer) {
            const totalTokensElement = document.getElementById('totalTokens');
            const totalCostElement = document.getElementById('totalCost');
            const totalRequestsElement = document.getElementById('totalRequests');

            if (totalTokensElement) totalTokensElement.textContent = statsData.totalTokens.toLocaleString();
            if (totalCostElement) totalCostElement.textContent = `$${statsData.estimatedCost}`;
            if (totalRequestsElement) totalRequestsElement.textContent = statsData.totalRequests.toLocaleString();
        }
    } catch (error) {
        console.error('Error updating usage stats:', error);
    }
}

// Reset statistics
export function resetStats() {
    statsData = {
        generationTime: 0,
        totalTokens: 0,
        estimatedCost: 0,
        totalRequests: 0
    };
    updateStatsDisplay();
} 