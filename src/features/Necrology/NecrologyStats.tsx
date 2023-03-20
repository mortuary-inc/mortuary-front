import { useMortuaryContext } from 'context/MortuaryContext';
import useBurnStat from 'hooks/useBurnStat';
import { INecroStats } from './api/NecrologyModel';

interface INecrologyStatsProps {
  stats: INecroStats | null;
  owner?: string;
  voxelID?: string;
}

const NecrologyStats = ({ stats, owner, voxelID }: INecrologyStatsProps) => {
  const { totalBurned, totalAsh, king, collectionBurned } = useBurnStat(stats, owner, voxelID);
  const { mode, viewWallet } = useMortuaryContext();
  return (
    <div className="mt-5 lg:mt-0 flex gap-6 border-secondary border-opacity-10 border p-3 rounded-xl">
      {mode == 0 ? (
        <div className="border-r border-secondary border-opacity-10 pr-3">
          <div className="font-sansLight text-secondary text-xs">GLOBAL STATS</div>
        </div>
      ) : (
        <div className="border-r border-secondary border-opacity-10 pr-3">
          <div className="font-sansLight text-secondary text-xs">{viewWallet ? 'USER STATS' : 'GLOBAL STATS'}</div>
        </div>
      )}
      <div>
        <div className="font-sansLight text-fourth text-xs">TOTAL BURNT</div>
        <div className="font-serif text-third text-2xl lg:text-3xl">{totalBurned.toLocaleString()}</div>
      </div>
      {mode == 0 ? (
        <div>
          <div className="font-sansLight text-fourth text-xs">KING OF THE PYRE</div>
          <div className="font-serif text-third text-2xl lg:text-3xl">{king}</div>
        </div>
      ) : (
        <></>
      )}
      <div>
        <div className="font-sansLight text-fourth text-xs">MOST BURNT COLLECTION</div>
        <div className="font-serif text-third text-2xl lg:text-3xl">{collectionBurned}</div>
      </div>
      <div>
        <div className="font-sansLight text-fourth text-xs">$ASH DROPPED</div>
        <div className="font-serif text-third text-2xl lg:text-3xl">{totalAsh.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default NecrologyStats;
