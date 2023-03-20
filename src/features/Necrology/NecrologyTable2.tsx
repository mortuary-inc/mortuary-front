import { onSnapshot, orderBy, query, where } from '@firebase/firestore';
import { logsCollection } from 'apiFire';
import { useMortuaryContext } from 'context/MortuaryContext';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as fireAPI from 'services/helloFire';
import { cleanNecrologyData, INecrologyData } from './api/NecrologyModel2';
import NecrologyItem from './NecrologyItem2';


interface NecrologyTableProps {
  itemPerTable: number;
}

const NecrologyTable = ({ itemPerTable }: NecrologyTableProps) => {
  const unmounted = useRef(false);
  const [page, setPage] = useState<number>(0);
  //const [necrologyData, setNecrologyData] = useState<INecrologyData[]>([]);
  const [necrologyData, setNecrologyData] = useState<INecrologyData[]>([]);
  const [copyData, setCopyData] = useState<INecrologyData[]>([]);
  const [firstDataLoaded, setFirstDataLoaded] = useState<INecrologyData[]>([]);
  const location = useLocation();
  const { mode, viewWallet } = useMortuaryContext();
  const [isHomepage, setIsHomepage] = useState(true);

  //const [logsData, setLogsData] = useState<ILogs>({"total":0,"ash":0});

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    location.pathname === '/' ? setIsHomepage(true) : setIsHomepage(false);
  }, [location]);

  /* For Matt... Here the listener should append the content to the existing data.
  However it doesn't, it just replace the existing content... */
  
  useEffect(() => {
    const q = query(logsCollection, where("date",">", new Date()), orderBy("date", "desc"))
    //const datax : INecrologyData[]= [...necrologyData];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let newNecro : INecrologyData[] = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data().id)
            let x : INecrologyData = {
              _createdAt: doc.data()._createdAt,
              id: doc.data().id,
              _id: doc.data()._id,
              date: doc.data().date,
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
          console.log(querySnapshot.size + " / " + typeof(querySnapshot.size))
          let newData;
          if(querySnapshot.size >= 1){
            newData = [...newNecro, ...previous.slice(querySnapshot.size)];
          } else {
            newData = [...newNecro, ...previous];
          }
          
          return newData;
        });
      })
      return () => {
        unsubscribe()
      }
    }, [])
    
    useEffect(() => {
      const { necrologyDataCleaned } = cleanNecrologyData(copyData);
      setNecrologyData(necrologyDataCleaned);
    }, [copyData]);

  useEffect(() => {
    let offset = itemPerTable * page;
    fireAPI.getNecroPaginate(itemPerTable).then((necrologyDataAPI) => {
      if (unmounted.current) return;
      setCopyData(necrologyDataAPI);
      setFirstDataLoaded(necrologyDataAPI);
    });
    
   
  }, [page, itemPerTable, viewWallet]);


  
  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected);
  };

  return (
    <>
      <div className="w-full mb-6 sm:mb-12">
        <div className="hidden md:flex text-third font-sansLight border-b-2 border-primary-h pb-2">
          <div className="font-normal w-52">Dates:</div>
          <div className="font-normal w-64">Name:</div>
          {isHomepage ? (
            <></>
           ) : (
            <div className="font-normal w-64 xl:block">Collection:</div>
          )}
          {viewWallet ? ( // If it's not MyMortuary / Commons
            <div className="font-normal w-36">$ASH earned:</div>
          ) : (
            <div className="font-normal w-36">Owner:</div>
          )}
        </div>
        <div>
          {necrologyData.map(function (item) {
            return <NecrologyItem key={'NecrologyItem-' + item._id} item={item} isHome={isHomepage} />;
          })}
        </div>
      </div>
    </>
  );
};

export default NecrologyTable;
