import { ReactChild, ReactChildren } from 'react';

interface SimpleButtonProps {
  link?: string;
  children: ReactChild | ReactChildren;
}

const BigButton = ({ children, link }: SimpleButtonProps) => {
  return (
    <a
      className=" inline-block font-sans text-xl px-4 bg-third mt-10 pt-2 pb-1 text-primary rounded-xl mb-14 sm:mb-20 hover:bg-third-h active:bg-third-a transition-colors duration-500 ease-in-out"
      href={link}
    >
      {children}
    </a>
  );
};

export default BigButton;
