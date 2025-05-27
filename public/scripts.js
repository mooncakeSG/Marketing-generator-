// Debug: Log script initialization
console.log('Script starting initialization');

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
const loadingSpinner = document.getElementById('loadingSpinner');
const form = document.getElementById('generatorForm');
const prompt = document.getElementById('prompt');
const toneLabel = document.getElementById('toneLabel');
const historyPanel = document.getElementById('historyPanel');
const spinner = document.querySelector('.spinner');
const mascot = document.querySelector('.mascot');

// Mock history data
const mockHistory = [
    "Engaging product launch copy for the next generation smartwatch",
    "Compelling email campaign for summer sale promotion",
    "Professional service description for consulting firm",
    "Casual social media post for coffee shop opening"
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
        loadingSpinner.classList.remove('hidden');

        console.log('Sending request with prompt:', prompt);
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

        const data = await response.json();
        console.log('Received API response:', data);

        // Hide spinner
        loadingSpinner.classList.add('hidden');

        if (!response.ok) {
            const errorMessage = data.details || data.error || 'Failed to generate content';
            throw new Error(errorMessage);
        }

        if (!data.choices?.[0]?.message?.content) {
            console.error('Invalid response format:', data);
            throw new Error('Invalid response format from server');
        }

        const generatedText = data.choices[0].message.content;
        console.log('Generated text:', generatedText);

        // Update result area with the generated text
        resultDiv.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div class="text-gray-900 dark:text-white whitespace-pre-wrap mb-4">${generatedText}</div>
                <div class="flex justify-between items-center">
                    <button onclick="copyToClipboard(this)" class="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        </svg>
                        Copy to Clipboard
                    </button>
                    <span class="text-xs text-gray-500 dark:text-gray-400">Generated with AI21</span>
                </div>
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

    } catch (error) {
        console.error('Error details:', error);
        resultDiv.innerHTML = `
            <div class="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <p class="font-medium">Error generating copy:</p>
                <p class="mt-1">${error.message}</p>
                <button onclick="retryGeneration()" class="mt-3 px-4 py-2 text-sm bg-red-100 dark:bg-red-800 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
                    Try Again
                </button>
            </div>`;
    } finally {
        generateBtn.disabled = false;
        clearBtn.disabled = false;
        loadingSpinner.classList.add('hidden');
    }
}

function retryGeneration() {
    generateCopy();
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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Debug: Check if main elements exist
    const debugElements = {
        form: document.getElementById('generatorForm'),
        prompt: document.getElementById('prompt'),
        toneSlider: document.getElementById('toneSlider'),
        toneLabel: document.getElementById('toneLabel'),
        historyPanel: document.getElementById('historyPanel'),
        darkModeToggle: document.getElementById('darkModeToggle'),
        spinner: document.querySelector('.spinner'),
        mascot: document.querySelector('.mascot'),
        mainContent: document.querySelector('.main-content')
    };

    // Debug: Log which elements were found/not found
    Object.entries(debugElements).forEach(([name, element]) => {
        console.log(`${name}: ${element ? 'Found' : 'Not found'}`);
    });

    // Assign found elements to variables
    const {
        form,
        prompt,
        toneSlider,
        toneLabel,
        historyPanel,
        darkModeToggle,
        spinner,
        mascot,
        mainContent
    } = debugElements;

    // Mock history data
    const mockHistory = [
        "Engaging product launch copy for the next generation smartwatch",
        "Compelling email campaign for summer sale promotion",
        "Professional service description for consulting firm",
        "Casual social media post for coffee shop opening"
    ];

    // Initialize GSAP animations
    function initAnimations() {
        console.log('Initializing animations');
        
        // Make sure content is visible first
        if (mainContent) {
            mainContent.style.opacity = '1';
            console.log('Main content visibility set to visible');
        }

        // Initial page load animation
        gsap.to('.main-content', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => console.log('Main content fade-in complete')
        });

        // Mascot floating animation
        if (mascot) {
            gsap.to(mascot, {
                y: -10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });
        }

        // Button hover animations
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.2
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.2
                });
            });

            button.addEventListener('mousedown', () => {
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1
                });
            });

            button.addEventListener('mouseup', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.1
                });
            });
        });
    }

    // Dark mode toggle
    function initDarkMode() {
        console.log('Initializing dark mode');
        if (!darkModeToggle) {
            console.log('Dark mode toggle not found');
            return;
        }

        const isDark = localStorage.getItem('darkMode') === 'true';
        document.documentElement.classList.toggle('dark', isDark);

        darkModeToggle.addEventListener('click', () => {
            // Fade out
            gsap.to('body', {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    document.documentElement.classList.toggle('dark');
                    // Fade in
                    gsap.to('body', {
                        opacity: 1,
                        duration: 0.3
                    });
                    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
                }
            });
        });
    }

    // Tone slider functionality
    function initToneSlider() {
        console.log('Initializing tone slider');
        if (!toneSlider || !toneLabel) {
            console.log('Tone slider or label not found');
            return;
        }

        function updateToneLabel(value) {
            let tone = 'Neutral';
            if (value <= 32) tone = 'Casual';
            else if (value > 66) tone = 'Formal';
            toneLabel.textContent = tone;

            // Animate the label change
            gsap.from(toneLabel, {
                y: -10,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        toneSlider.addEventListener('input', (e) => {
            updateToneLabel(e.target.value);
        });

        // Initialize with default value
        updateToneLabel(toneSlider.value);
    }

    // Populate history panel
    function populateHistory() {
        console.log('Populating history panel');
        if (!historyPanel) {
            console.log('History panel not found');
            return;
        }
        
        // Clear existing content
        historyPanel.innerHTML = '';

        mockHistory.forEach(text => {
            const item = document.createElement('div');
            item.className = 'history-item text-gray-700 dark:text-gray-300 text-sm';
            item.textContent = text;
            historyPanel.appendChild(item);

            // Animate each history item
            gsap.from(item, {
                x: -20,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    // Form submission handling
    if (form) {
        console.log('Setting up form handlers');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!prompt || !prompt.value.trim()) {
                console.error('No prompt provided');
                return;
            }

            // Show spinner
            if (spinner) {
                spinner.classList.remove('hidden');
                spinner.classList.add('active');
            }
            
            // Disable form
            form.querySelectorAll('button, input, textarea').forEach(el => el.disabled = true);
            
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: prompt.value,
                        tone: toneSlider ? toneSlider.value : 50
                    })
                });

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error);
                }

                if (historyPanel && data.choices?.[0]?.message?.content) {
                    // Add to history panel
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item text-gray-700 dark:text-gray-300 text-sm';
                    historyItem.textContent = data.choices[0].message.content;
                    historyPanel.insertBefore(historyItem, historyPanel.firstChild);

                    // Animate new history item
                    gsap.from(historyItem, {
                        x: -20,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }

            } catch (error) {
                console.error('Generation error:', error);
            } finally {
                // Hide spinner after 2 seconds (simulated delay)
                if (spinner) {
                    setTimeout(() => {
                        spinner.classList.add('hidden');
                        spinner.classList.remove('active');
                        // Re-enable form
                        form.querySelectorAll('button, input, textarea').forEach(el => el.disabled = false);
                    }, 2000);
                }
            }
        });

        // Clear form
        form.addEventListener('reset', () => {
            if (!prompt) return;
            
            // Animate clear
            gsap.to(prompt, {
                scale: 0.95,
                opacity: 0.5,
                duration: 0.2,
                onComplete: () => {
                    prompt.value = '';
                    gsap.to(prompt, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.2
                    });
                }
            });
        });
    }

    // Initialize everything
    console.log('Starting initialization sequence');
    initAnimations();
    initDarkMode();
    initToneSlider();
    populateHistory();
    console.log('Initialization sequence complete');
});

// Debug: Log when script reaches the end
console.log('Script loaded completely'); 