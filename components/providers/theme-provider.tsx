import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useColorScheme as useRNColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const systemColorScheme = useRNColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const resolvedTheme =
    theme === 'system' ? (systemColorScheme ?? 'light') : theme;

  useEffect(() => {
    // Update NativeWind color scheme when theme changes
    setColorScheme(resolvedTheme);
  }, [resolvedTheme, setColorScheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
