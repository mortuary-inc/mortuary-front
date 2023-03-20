import { ReactChild, ReactChildren } from 'react';

interface H2Props {
  children: ReactChild | ReactChildren;
  className?: string;
}

const H2 = ({ children, className }: H2Props) => {
  return <h2 className={(className || '') + ' text-2xl sm:text-3xl font-serif font-extralight mb-3'}>{children}</h2>;
};

export default H2;
