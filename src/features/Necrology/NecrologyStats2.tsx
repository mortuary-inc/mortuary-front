import { Mode, useMortuaryContext } from 'context/MortuaryContext';
import useBurnStat from 'hooks/useBurnStat';
import { ILogs } from './api/NecrologyModel2';

interface INecrologyStatsProps {
  stats: ILogs;
  owner?: string;
  voxelID?: string;
}

const NecrologyStats = ({ stats, owner, voxelID }: INecrologyStatsProps) => {
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
        <div className="font-serif text-third text-2xl lg:text-3xl">{stats?.total? stats?.total.toLocaleString() : "0"}</div>
      </div>
      <div>
        <div className="font-sansLight text-fourth text-xs">$ASH DROPPED</div>
        <div className="font-serif text-third text-2xl lg:text-3xl">{stats?.ash? stats?.ash.toLocaleString() : "0"}</div>
      </div>
    </div>
  );
};

export default NecrologyStats;
