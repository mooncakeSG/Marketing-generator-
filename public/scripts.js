// Initialize variables
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const promptInput = document.getElementById('prompt');
const resultDiv = document.getElementById('result');
const toneSlider = document.getElementById('tone-slider');
const toneValue = document.getElementById('tone-value');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const sunIcon = document.querySelector('.sun');
const moonIcon = document.querySelector('.moon');

// Mock history data
let mockHistory = [
    { type: 'Product Launch', content: 'Introducing our revolutionary smartwatch that combines cutting-edge health tracking with seamless productivity features...' },
    { type: 'Social Media', content: 'Transform your daily routine with AI-powered insights. Our smartwatch learns your patterns and helps you achieve more...' },
    { type: 'Email Campaign', content: 'Limited time offer: Experience the future of health and productivity with 30% off our premium smartwatch...' }
];

// Templates
const templates = {
    product: "Write a compelling marketing copy for [Product Name]. Focus on its key features: [Feature 1], [Feature 2], [Feature 3]. Target audience: [Describe Audience]. Tone: Professional and exciting.",
    service: "Create a persuasive marketing copy for [Service Name]. Highlight the main benefits: [Benefit 1], [Benefit 2]. Include a strong call to action. Target audience: [Describe Audience]. Tone: Friendly and trustworthy.",
    social: "Write an engaging social media post for [Product/Service]. Include key selling points and relevant hashtags. Keep it concise and attention-grabbing. Tone: Casual and energetic.",
    email: "Create an email marketing campaign for [Product/Service]. Include an attention-grabbing subject line, compelling body copy, and clear call-to-action. Focus on benefits and urgency. Tone: Professional with a personal touch."
};

// Initialize page animations
function initializeAnimations() {
    // Fade in body
    gsap.to('body', { opacity: 1, duration: 0.5 });

    // Header animation
    gsap.from('header', { 
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Main content animation
    gsap.from('main > div', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Template buttons animation
    gsap.from('.template-btn', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: 'back.out(1.7)'
    });

    // History panel animation
    gsap.from('aside', {
        x: 30,
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out'
    });
}

// Initialize history panel
function populateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = mockHistory.map(item => `
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 shadow-sm transition-all hover:shadow-md">
            <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">${item.type}</div>
            <p class="text-xs text-gray-600 dark:text-gray-300">${item.content.substring(0, 100)}...</p>
        </div>
    `).join('');

    // Animate new history items
    gsap.from('#historyList > div', {
        x: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// Tone slider functionality
toneSlider.addEventListener('input', () => {
    const value = parseInt(toneSlider.value);
    let tone = 'Neutral';
    
    if (value <= 32) tone = 'Casual';
    else if (value <= 66) tone = 'Neutral';
    else tone = 'Formal';
    
    // Update tone value display
    toneValue.textContent = `Current Tone: ${tone}`;
    
    // Animate tone value change
    gsap.from(toneValue, {
        y: -10,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
});

// Dark mode toggle
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
    
    // Animate transition
    gsap.to('body', {
        backgroundColor: isDark ? '#111827' : '#f9fafb',
        duration: 0.3
    });
}

// Button hover animations
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Template selection
function useTemplate(type) {
    promptInput.value = templates[type];
    promptInput.focus();
    const placeholder = promptInput.value.match(/\[.*?\]/);
    if (placeholder) {
        const start = promptInput.value.indexOf(placeholder[0]);
        promptInput.setSelectionRange(start, start + placeholder[0].length);
    }
}

// Generate copy function
async function generateCopy() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        resultDiv.innerHTML = `
            <div class="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
                Please enter a prompt
            </div>`;
        return;
    }

    try {
        generateBtn.disabled = true;
        clearBtn.disabled = true;

        // Show loading spinner
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.remove('hidden');

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                prompt,
                tone: toneSlider.value 
            })
        });

        if (!response.ok) {
            throw new Error('Server responded with status: ' + response.status);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        // Hide spinner
        spinner.classList.add('hidden');

        // Extract the generated text from the response
        let generatedText = '';
        if (data.choices && data.choices[0] && data.choices[0].message) {
            generatedText = data.choices[0].message.content;
        } else if (data.completions && data.completions[0]) {
            generatedText = data.completions[0].data.text;
        } else if (typeof data === 'string') {
            generatedText = data;
        } else {
            console.log('Unexpected response format:', data);
            throw new Error('Unexpected response format from server');
        }

        if (generatedText) {
            // Update result area with the generated text
            resultDiv.innerHTML = `
                <div class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                    <div class="text-gray-900 dark:text-white whitespace-pre-wrap mb-4">${generatedText}</div>
                    <button onclick="copyToClipboard(this)" class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        </svg>
                        Copy to Clipboard
                    </button>
                </div>`;

            // Add to history
            mockHistory.unshift({
                type: 'Generated Copy',
                content: generatedText
            });

            // Keep only the last 10 items in history
            if (mockHistory.length > 10) {
                mockHistory = mockHistory.slice(0, 10);
            }

            // Update history panel
            populateHistory();

            // Animate result
            gsap.from('#result > div', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.out'
            });
        }
    } catch (error) {
        console.error('Error details:', error);
        resultDiv.innerHTML = `
            <div class="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
                Error generating copy: ${error.message}
            </div>`;
    } finally {
        generateBtn.disabled = false;
        clearBtn.disabled = false;
    }
}

// Clear function
function clearAll() {
    promptInput.value = '';
    resultDiv.innerHTML = '';
    promptInput.focus();
}

// Copy to clipboard function
async function copyToClipboard(button) {
    const textToCopy = button.parentElement.querySelector('div').textContent;
    try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = button.innerHTML;
        button.innerHTML = `
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            Copied!`;
        
        gsap.from(button, {
            scale: 0.9,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text:', err);
    }
}

// Event listeners
darkModeToggle.addEventListener('click', toggleDarkMode);
promptInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        generateCopy();
    }
});

// Initialize
window.addEventListener('load', () => {
    initializeAnimations();
    populateHistory(); // Initialize history panel on load
}); 