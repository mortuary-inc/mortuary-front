import { useContext } from 'react';
import { ThemeContext } from './ThemeWrapper';

const ContactUndertakers = () => {
  const darkMode = useContext(ThemeContext);

  return (
    <a
      className={
        (darkMode ? 'border-secondary' : 'border-primary') +
        ' border rounded-2xl px-3 py-1 pt-2 inline-block hover:bg-secondary hover:text-primary transition-colors duration-200 ease-in-out'
      }
      href={"https://discord.gg/sMUu9REvU8"}
      target="_blank"
      rel="noreferrer"
    >
      Contact
    </a>
  );
};

export default ContactUndertakers;
