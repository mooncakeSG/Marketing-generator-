// Initialize variables
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const promptInput = document.getElementById('prompt');
const resultDiv = document.getElementById('result');
const toneSlider = document.getElementById('tone');
const toneValue = document.getElementById('toneValue');
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const sunIcon = document.querySelector('.sun');
const moonIcon = document.querySelector('.moon');

// Mock history data
const mockHistory = [
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
    gsap.to('.header', { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: 'power3.out' 
    });

    // Dark mode toggle
    gsap.to('.dark-mode-toggle', { 
        opacity: 1, 
        duration: 0.5, 
        delay: 0.2 
    });

    // Mascot animation
    gsap.to('.mascot', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Continuous mascot float animation
    gsap.to('.mascot', {
        y: '+=10',
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });

    // Card animation
    gsap.to('.card', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
    });

    // Template buttons animation
    gsap.to('.template-btn', {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: 'back.out(1.7)'
    });

    // Tone control animation
    gsap.to('.tone-control', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.7,
        ease: 'power3.out'
    });

    // Button group animation
    gsap.to('button:not(.template-btn)', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.8,
        ease: 'power3.out'
    });

    // History panel items animation
    gsap.to('.history-item', {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 1,
        ease: 'power3.out'
    });
}

// Initialize history panel
function populateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = mockHistory.map(item => `
        <div class="history-item">
            <strong>${item.type}</strong>
            <p>${item.content.substring(0, 100)}...</p>
        </div>
    `).join('');

    // Animate new history items
    gsap.from('.history-item', {
        opacity: 0,
        x: 20,
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
    
    // Animate tone value change
    gsap.to(toneValue, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            toneValue.textContent = tone;
            gsap.to(toneValue, {
                opacity: 1,
                duration: 0.2
            });
        }
    });
});

// Dark mode toggle
function toggleDarkMode() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    // Fade out
    gsap.to('body', {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            // Toggle theme
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            sunIcon.style.display = isDark ? 'block' : 'none';
            moonIcon.style.display = isDark ? 'none' : 'block';
            
            // Fade in
            gsap.to('body', {
                opacity: 1,
                duration: 0.2
            });
        }
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

    button.addEventListener('click', () => {
        gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
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
        resultDiv.innerHTML = '<div class="error">Please enter a prompt</div>';
        return;
    }

    try {
        generateBtn.disabled = true;
        clearBtn.disabled = true;

        // Show and animate spinner
        const spinner = document.getElementById('loadingSpinner');
        spinner.style.display = 'block';
        gsap.to(spinner, {
            opacity: 1,
            duration: 0.3,
            onStart: () => {
                spinner.style.animation = 'spin 1s linear infinite';
            }
        });

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

        // Hide spinner
        gsap.to(spinner, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                spinner.style.display = 'none';
                spinner.style.animation = 'none';
            }
        });

        if (data.choices && data.choices[0]) {
            const generatedText = data.choices[0].message.content;
            
            resultDiv.innerHTML = `
                <div class="result-card">${generatedText}</div>
                <button onclick="copyToClipboard()" class="copy-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    </svg>
                    Copy to Clipboard
                </button>`;

            // Animate result card
            gsap.from('.result-card', {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power3.out'
            });

            // Add to history
            mockHistory.unshift({
                type: 'Custom',
                content: generatedText
            });
            populateHistory();

        } else if (data.error) {
            resultDiv.innerHTML = '<div class="error">Error: ' + data.error + '</div>';
        } else {
            resultDiv.innerHTML = '<div class="error">No response generated</div>';
        }
    } catch (error) {
        resultDiv.innerHTML = '<div class="error">Error generating copy: ' + error.message + '</div>';
        console.error('Error:', error);
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
async function copyToClipboard() {
    const resultCard = document.querySelector('.result-card');
    if (resultCard) {
        try {
            await navigator.clipboard.writeText(resultCard.textContent);
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
            
            // Animate copy button
            gsap.from(copyBtn, {
                scale: 0.9,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
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
    populateHistory();
}); 