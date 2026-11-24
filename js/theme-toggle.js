// Theme toggle: syncs the checkbox with the current theme and persists changes.
const toggleCheckbox = document.getElementById('theme-toggle-checkbox');

// Initial setup based on current theme attribute
const currentTheme = document.documentElement.getAttribute('data-theme');
if (currentTheme === 'dark') {
    toggleCheckbox.checked = true;
}

toggleCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});
