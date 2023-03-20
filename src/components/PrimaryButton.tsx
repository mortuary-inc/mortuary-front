import { ReactChild, ReactChildren } from 'react';

interface SimpleButtonProps {
  link?: string;
  alt?: boolean;
  children: ReactChild | ReactChildren;
  blank?: boolean;
}

const PrimaryButton = ({ children, link, alt, blank }: SimpleButtonProps) => {
  return (
    // eslint-disable-next-line
    <a
      className={
        (alt ? 'bg-fourth hover:bg-fourth-h' : 'bg-third hover:bg-third-h ') +
        ' border text-primary hover:text-primary-h rounded-2xl font-sans px-4 py-1 pt-2 inline-block text-center lg:text-left transition-colors duration-200 ease-in-out'
      }
      href={link}
      target={blank ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export default PrimaryButton;
