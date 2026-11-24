// Sets the theme before rendering to avoid flicker. Loaded synchronously in <head>.
(function () {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();
