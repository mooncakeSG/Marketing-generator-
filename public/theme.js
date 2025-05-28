// Theme management
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.className = savedTheme;
    
    const themeButton = document.getElementById('themeButton');
    if (themeButton) {
        updateThemeButton(themeButton, savedTheme);
        
        themeButton.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.className;
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.className = newTheme;
            localStorage.setItem('theme', newTheme);
            updateThemeButton(themeButton, newTheme);
        });
    }
});

function updateThemeButton(button, theme) {
    button.innerHTML = `
        ${theme === 'dark' ? 'Light' : 'Dark'} Mode
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${theme === 'dark' 
                ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>'
                : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'}
        </svg>
    `;
} 