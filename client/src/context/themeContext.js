import { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { saveDarkMode } from '../utils/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const darkMode = useSelector((state) => state.themeReducer.darkMode);

    useEffect(() => {
        saveDarkMode(darkMode);
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={ darkMode }>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
