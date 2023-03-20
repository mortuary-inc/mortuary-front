import { useContext } from 'react';
import { ThemeContext } from './ThemeWrapper';
import { ReactChild, ReactChildren } from 'react';

interface SimpleButtonProps {
  link?: string;
  light?: boolean;
  blank?: boolean;
  children: ReactChild | ReactChildren;
}

const SimpleButton = ({ children, link, light, blank }: SimpleButtonProps) => {
  const darkMode = useContext(ThemeContext);
  const dark = light ? false : darkMode;
  return (
    <a
      className={
        (dark ? 'border-secondary hover:bg-secondary text-secondary' : 'border-primary hover:bg-primary hover:text-secondary') +
        ' border rounded-xl font-sansLight px-4 py-1 pt-2 inline-block hover:text-primary transition-colors duration-200 ease-in-out'
      }
      href={link}
      target={blank ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export default SimpleButton;
