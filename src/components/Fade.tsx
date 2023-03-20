import { ReactChild, ReactChildren, ReactFragment } from 'react';

interface FadeProps {
  children: ReactChild | ReactChildren | ReactFragment;
  bottom: boolean;
}

const Fade = ({ children }: FadeProps) => {
  return (
    <>
      {children}
    </>
  );
};

export default Fade;
