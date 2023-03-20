import BodyIntro from 'components/HomeIntro';
import { Routes } from 'routes/conf';
import BigButton from 'components/BigButton';
import { useEffect, useState } from 'react';
import { ILogs } from '../../Necrology/api/NecrologyModel2';
import NecrologyTable from '../../Necrology/NecrologyTable2';
// Import firestore helpers
import { doc, onSnapshot } from '@firebase/firestore'
// Import our db object
import {globalCollection } from 'apiFire'
import { getAshTokenSupply } from 'web3/Accounts'
import * as fireAPI from 'services/helloFire';
import { truncateAddress } from 'lib/utils';

const HomePage = () => {
  //const darkMode = useContext(ThemeContext);
  const [logsData, setLogsData] = useState<ILogs>({"total":0,"ash":0});
  const [ashTokenSupply, setAshTokenSupply] = useState<any | null>(null);
  const [bigBurner, setBigBurner] = useState<String>("");
  const [ashPrice, setAshPrice] = useState<Number>(0);
  const [ashTotal, setAshTotal] = useState<Number>(0);

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

    useEffect(() => {
      let ashInfo = getAshTokenSupply().then(e => {
            setAshTokenSupply(e);

      }) 
    }, [])

    useEffect(() => {
      let big = fireAPI.getBigBurner().then(e => {
        setBigBurner(truncateAddress(e));
      })
    }, [])

    useEffect(() => {
      fireAPI.getAshData().then(e => {
        setAshPrice(e.price);
        setAshTotal(e.total);
      })
    }, [])


  return (
    <>
      <BodyIntro />
      <div className="hidden justify-center space-x-4">
        <BigButton link={Routes.MyMortuary}>Burn trash</BigButton>
        <BigButton link={Routes.Cleaner}>Clean your wallet</BigButton>
        <BigButton link="https://famousfoxes.com/tokenmarket/Ash">Trade $ASH</BigButton>
      </div>
      <div className='lg:w-2/4 mx-auto'>
      <div className='sm:grid sm:grid-cols-2 border-t-2 border-primary-h mb-2 pt-2'>
        <div className=''>
          <div className='text-third font-sansLight mb-2'>Total NFTs burnt</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{logsData?.total? logsData?.total.toLocaleString() : "0"}</div>
        </div>
        <div className='text-left pt-2 border-t-2 border-primary-h sm:text-right sm:pt-0 sm:border-t-0'>
          <div className='text-third font-sansLight mb-2'>$ASH earned</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{logsData?.ash? logsData?.ash.toLocaleString() : "0"}</div>
        </div>
      </div>
      <div className='sm:grid sm:grid-cols-2 border-t-2 border-primary-h mb-2 pt-2'>
        <div className=''>
          <div className='text-third font-sansLight mb-2'>Total $ASH cap</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{Number(ashTokenSupply?.cap).toLocaleString()}</div>
        </div>
        <div className='text-left pt-2 border-t-2 border-primary-h sm:text-right sm:pt-0 sm:border-t-0'>
          <div className='text-third font-sansLight mb-2'>$ASH Pool</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{Number(ashTokenSupply?.pool).toLocaleString()}</div>
        </div>
      </div>
      <div className='sm:grid sm:grid-cols-2 border-t-2 border-primary-h mb-2 pt-2'>
        <div className=''>
          <div className='text-third font-sansLight mb-2'>$ASH price in SOL</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{ashPrice}</div>
        </div>
        <div className='text-left pt-2 border-t-2 border-primary-h sm:text-right sm:pt-0 sm:border-t-0'>
          <div className='text-third font-sansLight mb-2'>$ASH available on FFF</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{ashTotal.toLocaleString()}</div>
        </div>
      </div>
      <div className='sm:grid sm:grid-cols-2 border-t-2 border-primary-h mb-2 pt-2'>
        <div className=''>
          <div className='text-third font-sansLight mb-2'>Last burnt</div>
          <div className="text-secondary font-sansLight text-4xl md:text-5xl mb-2">The Necrology</div>
        </div>
        <div className='text-left pt-2 border-t-2 border-primary-h sm:text-right sm:pt-0 sm:border-t-0'>
          <div className='text-third font-sansLight mb-2'>Biggest burner</div>
          <div className="text-secondary font-sansLight text-4xl sm:text-5xl mb-2">{bigBurner}</div>
        </div>
      </div>
      
      </div>
      <div className="py-16">
      <div className='lg:w-2/4 mx-auto'>
        <NecrologyTable itemPerTable={10} />
      </div>
      <div className={'text-secondary mt-8 sm:mt-14 md:w-4/5 lg:w-2/4 xl:w-3/5 m-auto text-center'}>
      <h2 className='font-sansLight text-xl mb-8 opacity-25'>Artist collaborations</h2>
      <div className='md:grid md:grid-cols-2 gap-8'>
      
      <div className='artist'>
      <h3 className='font-sansLight text-4xl'>lukexdod</h3>
      <span></span>
      <a href="https://www.esthersescape.xyz/esthers-mortuary-plunder" className='nav-link relative font-sansLight' target="_blank">Mortuary Plunder</a>
      <a href="https://exchange.art/series/Esther's%20Mortuary%20Plunder" target="_blank">
        <div className='relative'>
        <span className="flex absolute top-4 left-4 -mt-1 -mr-1 text-third uppercase text-xxs tracking-wider	">
                
                <span className='break-none text-left'>Current collaboration<br/>
                  Every week 3 auctions, 1 raffle in $ASH
                </span>
              </span>
        <img
                    src="../assets/luke/luke-thumb.png"
                    alt="Zen0verse Unearthed Banner by zen0"
                    className={'rounded-xl transition-opacity ease-in-out duration-300 mt-3 mb-3 border-solid border-4 border-third'}
                  />
        </div>
       
                  <span className='nav-link relative font-sansLight'>View on Exchange Art</span>
                </a>
      </div>
      <div className='artist mt-8 md:mt-0'>
      <h3 className='font-sansLight text-4xl'>Zen0</h3>
      <a href="https://zen0verse.notion.site/zen0verse/zen0m-3c25fb96ba654022961f58e048b1cadb" className='nav-link relative font-sansLight' target="_blank">Zen0verse Unearthed</a>
      <a href="https://exchange.art/series/Zen0verse%20Unearthed/nfts" className='nav-link relative font-sansLight' target="_blank">
        <img
                    src="../assets/zen0/zen0-thumb.gif"
                    alt="Zen0verse Unearthed Banner by zen0"
                    className={'rounded-xl transition-opacity ease-in-out duration-300 mt-3 mb-3 hover:opacity-50 '}
                  />
                  <span className='nav-link relative font-sansLight'>View on Exchange Art</span>
      </a>
      </div>
      </div>
      
    </div>
    </div>
    </>
  );
};

export default HomePage;
