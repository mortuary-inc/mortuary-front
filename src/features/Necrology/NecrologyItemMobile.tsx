import LazyLoad from 'react-lazyload';
import { INecrologyData } from './api/NecrologyModel';

interface NecrologyItemProps {
  item: INecrologyData;
  solscanLink: string;
}

const NecrologyItemMobile = ({ item, solscanLink }: NecrologyItemProps) => {
  return (
    <div className="md:hidden">
      <div className="flex justify-between pt-3">
        <div className="text-left">
          <div className="text-secondary opacity-50 text-xs">{item.date}</div>
          <div className="mt-1">
            <LazyLoad height={24} classNamePrefix="inline lazyload">
              <img className="inline rounded-md h-6 w-6" src={item.thumbnail + '?h=24'} alt="IDImg" />
            </LazyLoad>
            <span className="align-middle ml-3">{item.id}</span>
            <span className="align-middle ml-3">{item.collection}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-sansLight text-fourth text-xs">Owner</div>
          <div className="mt-1">{item.owner}</div>
        </div>
      </div>
      <div className="text-left mt-3 pb-3">
        <div className="font-sansLight text-fourth text-xs">Last Words</div>
        <div className="flex justify-between mt-1">
          {/* <div>{item.lastWords}</div> */}
          {solscanLink && (
            <a href={solscanLink} target="_blank" rel="noopener noreferrer">
              ⟶
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NecrologyItemMobile;
