// toggle_theme.js
export function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

export function initializeThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }

    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);

    themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
}
