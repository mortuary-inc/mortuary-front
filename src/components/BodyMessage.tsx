import { useContext } from 'react';
import BigText from './BigText';
import { ThemeContext } from './ThemeWrapper';

interface BodyMessageProps {
  mainMessage: string;
  warning: string;
  cta: {
    link: string;
    callToAction: string;
  };
}

const BodyMessage = ({ mainMessage, warning, cta }: BodyMessageProps) => {
  const darkMode = useContext(ThemeContext);

  return (
    <div className={(darkMode ? 'text-secondary' : 'text-primary') + ' mt-8 sm:mt-14 md:w-4/5 lg:w-2/4 xl:w-3/5 m-auto'}>
      <BigText>{mainMessage}</BigText>
      <div className="font-sansLight text-sm mt-3">{warning}</div>
      <a className="font-sansLight text-sm underline-purple " href={cta.link}>
        {cta.callToAction}
      </a>
    </div>
  );
};

export default BodyMessage;
