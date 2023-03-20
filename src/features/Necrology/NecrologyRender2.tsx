import SimpleButton from 'components/SimpleButton';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes } from 'routes/conf';
import { ILogs } from './api/NecrologyModel2';
import NecrologyStats from './NecrologyStats2';
import NecrologyTable from './NecrologyTable2';
// Import firestore helpers
import { doc, onSnapshot } from '@firebase/firestore';
// Import our db object
import { globalCollection } from 'apiFire';

export const NecrologyID = 'Necrology_32532';

interface LocationState {
  from: {
    pathname: string;
  };
}

interface INecrologyRenderProps {
  withStats: boolean;
  owner?: string;
  voxelID?: string;
}


const NecrologyRender = ({ withStats, owner, voxelID }: INecrologyRenderProps) => {
  const location = useLocation<LocationState>();
  const [logsData, setLogsData] = useState<ILogs>({"total":0,"ash":0});


  useEffect(() => {
    const unsubscribe = onSnapshot(doc(globalCollection, "/logs"), (doc) => {
        console.log("Current data: ", doc.data());
        if (!doc.metadata.hasPendingWrites) {
            let vi: ILogs = {
                total : doc.data()?.total,
                ash : doc.data()?.ash
              };
          setLogsData(vi)
        }
      })
      return () => {
        unsubscribe()
      }
    }, [onSnapshot])

  //console.log("STATS 1 : " + JSON.stringify(necrologiesData));
  //console.log('WithStats :' + withStats + ' / Necro lenght :' + necrologiesData);
  return (
    <div id={NecrologyID} className="py-16 max-w-4xl mx-auto">
      <div className="text-left">
        <div className="text-secondary font-serif text-3xl mb-2">Necrology</div>
        <div className="lg:flex gap-x-24 xl:gap-x-24 mb-12 justify-between">
          <div className="flex-initial font-sansLight text-secondary text-sm md:w-2/4 xl:w-1/3">
          Let us observe a moment of contemplation in memory of those who passed away. They will remain forev’…For real? Get on with it, light that match already! 
            <div className="mt-4">
              {location.pathname != '/necrology/' ? <SimpleButton link={Routes.AllNecrology}>See the full Necrology</SimpleButton> : <></>}
            </div>
          </div>
          {withStats && <NecrologyStats stats={logsData} owner={owner} voxelID={voxelID} />}
        </div>
        <NecrologyTable itemPerTable={25} />
      </div>
    </div>
  );
};

export default NecrologyRender;
