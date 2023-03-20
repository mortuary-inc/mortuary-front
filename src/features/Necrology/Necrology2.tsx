
import NecrologyRender from './NecrologyRender2';


interface INecrologyProps {
  withStats: boolean;
}

const Necrology2 = ({ withStats }: INecrologyProps) => {

  return <NecrologyRender withStats={withStats} />;
};

export default Necrology2;
