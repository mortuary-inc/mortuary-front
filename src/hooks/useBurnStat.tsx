import { INecroStats } from 'features/Necrology/api/NecrologyModel';
import { useEffect, useState } from 'react';

const useBurnStat = (necrologiesData: INecroStats | null, owner: string | undefined, voxelID: string | undefined) => {
  const [totalBurned, setTotalBurned] = useState(0);
  const [totalAsh, setTotalAsh] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const king = necrologiesData ? necrologiesData.king : '';
  const collectionBurned = necrologiesData ? necrologiesData.collectionBurned : '';

  useEffect(() => {
    if (!necrologiesData) return;

    setTotalBurned(necrologiesData.totalBurn);
    setTotalAsh(necrologiesData.totalAsh);
    setTotalTax(necrologiesData.totalTax);
  }, [necrologiesData]);

  return { totalBurned, totalAsh, king, collectionBurned, totalTax };
};

export default useBurnStat;
