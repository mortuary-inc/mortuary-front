import { ReactChild, ReactChildren } from 'react';

interface BigTextProps {
  children: ReactChild | ReactChildren;
  className?: string;
}

const BigText = ({ children, className }: BigTextProps) => {
  return <div className={(className || '') + ' text-2xl sm:text-3xl font-serif font-extralight mb-4'}>{children}</div>;
};

export default BigText;
