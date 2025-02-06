const getStoredDarkMode = (defaultValue) => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
        return JSON.parse(storedDarkMode);
    }
    localStorage.setItem('darkMode', JSON.stringify(defaultValue));
    return defaultValue;
};

const saveDarkMode = (darkMode) => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
};

export {
    saveDarkMode,
    getStoredDarkMode
}