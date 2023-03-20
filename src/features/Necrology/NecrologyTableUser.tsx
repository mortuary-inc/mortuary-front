import { onSnapshot, orderBy, query, where } from '@firebase/firestore';
import { logsCollection } from 'apiFire';
import { useMortuaryContext } from 'context/MortuaryContext';
import { useEffect, useRef, useState } from 'react';
import * as fireAPI from 'services/helloFire';
import { cleanNecrologyData, INecrologyData } from './api/NecrologyModel2';
import NecrologyItem from './NecrologyItem2';


interface NecrologyTableProps {
  itemPerTable: number;
  owner: string;
  voxelID?: string;
}

const NecrologyTableUser = ({ itemPerTable, owner, voxelID }: NecrologyTableProps) => {

  
  const unmounted = useRef(false);
  const [page, setPage] = useState<number>(0);
  //const [necrologyData, setNecrologyData] = useState<INecrologyData[]>([]);
  const [necrologyData, setNecrologyData] = useState<INecrologyData[]>([]);
  const [copyData, setCopyData] = useState<INecrologyData[]>([]);
  const [firstDataLoaded, setFirstDataLoaded] = useState<INecrologyData[]>([]);
   
  const { mode, viewWallet } = useMortuaryContext();
  
  //const [logsData, setLogsData] = useState<ILogs>({"total":0,"ash":0});
  
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  
  useEffect(() => {
    const q = query(logsCollection, where("date",">", new Date()), where("owner", "==", owner), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let newNecro : INecrologyData[] = [];
      querySnapshot.forEach((doc) => {
          let x : INecrologyData = {
              _createdAt: doc.data()._createdAt,
              id: doc.data().id,
              _id: doc.data()._id,
              date:doc.data().date,
              collection: doc.data().collection,
              owner: doc.data().owner,
              //urlImage: string;
              thumbnail: doc.data().thumbnail,
              isLive: true,
              transactionID: doc.data().transactionID,
              voxelID: doc.data().voxelID,
              ash: doc.data().ash,
              tax: doc.data().tax,
              img: doc.data().img,
              storagePath:doc.data().storagePath
          }
          newNecro.push(x);
        });

        setCopyData((previous) => {
          let newData;
          if(querySnapshot.size >= 1){
            newData = [...newNecro, ...previous.slice(querySnapshot.size)];
          } else {
            newData = [...newNecro, ...previous];
          }
          
          return newData;
        });
      });
      return () => {
        unsubscribe()
      }
    }, [])
  
  useEffect(() => {
    const { necrologyDataCleaned } = cleanNecrologyData(copyData);
    setNecrologyData(necrologyDataCleaned);
  }, [copyData]);

  useEffect(() => {
    fireAPI.getNecroData(true, owner).then((necrologyDataAPI) => {
      if (unmounted.current) return;
      setCopyData(necrologyDataAPI);
      setFirstDataLoaded(necrologyDataAPI)
    });
  }, [page, itemPerTable, owner, voxelID, viewWallet]);

  return (
    <>
      <div className="w-full mb-6 sm:mb-12">
        <div className="hidden md:flex text-third font-sansLight border-b-2 border-primary-h pb-2">
          <div className="w-52">DATES:</div>
          <div className="w-64">ID:</div>
          <div className="w-64">COLLECTION:</div>
          {viewWallet ? ( // If it's not MyMortuary / Commons
            <div className="w-36">$ASH EARNED:</div>
          ) : (
            <div className="w-36">OWNER:</div>
          )}
        </div>
        <div>
          {necrologyData.map(function (item) {
            return <NecrologyItem key={'NecrologyItem-' + item._id} item={item} />;
          })}
        </div>
      </div>
    </>
  );
};

export default NecrologyTableUser;
