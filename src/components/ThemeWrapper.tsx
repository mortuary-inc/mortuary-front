import { createContext, ReactChild, ReactChildren } from 'react';
import Footer from './Footer/Footer';
import Navigation from './Navigation';

interface ThemeWrapperProps {
  children: ReactChild | ReactChildren;
  darkMode: boolean;
  nav: boolean;
  footer: boolean;
  forceH?: boolean;
  className?: string;
}

export const ThemeContext = createContext(false);

const ThemeWrapper = ({ children, darkMode, nav, footer, forceH, className }: ThemeWrapperProps) => {
  return (
    <ThemeContext.Provider value={darkMode}>
      <div className={(darkMode ? 'bg-primary' : 'bg-secondary') + (forceH ? ' min-h-screen ' : '') + (className ? className : '') + ' min-h-screen px-4 lg:px-8'}>
        <div className="lg:max-w-7xl m-auto">
          {nav ? <Navigation darkMode={darkMode} /> : <></>}
          {children}
          {footer ? <Footer /> : <></>}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeWrapper;
