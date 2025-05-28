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
    const icon = button.querySelector('i');
    const text = button.querySelector('span');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
        text.textContent = 'Light Mode';
    } else {
        icon.className = 'fas fa-sun';
        text.textContent = 'Dark Mode';
    }
} 