import { web3 } from '@project-serum/anchor';
import { useEffect, useState } from 'react';
import { findOpenPlots, OpenPlotInfo } from 'web3/Commons';
import ImgixClient from 'api/ImgixClient';
import { getRpcUrl } from 'web3/ConnectionHelper';

const CommonsList = () => {
  let [commons, setCommons] = useState<OpenPlotInfo[]>([]);

  useEffect(() => {
    (async () => {
      let connection = new web3.Connection(getRpcUrl());
      let found = await findOpenPlots(connection, 2500);
      setCommons(found);
    })();
  }, []);

  return (
    <div className="mt-10">
      <div className="text-center font-extralight mt-14 mb-10">
        <div className="text-secondary font-sansLight text-l">The Commons</div>
        <div className="text-third font-serif text-4xl">Public plots</div>
      </div>
      <div className="lg:w-2/4 mx-auto">
        {commons.map((info, index) => {
          return (
            <div
              key={index}
              className="bg-grayDark rounded-xl p-2 pr-4 border-4 border-primary hover:border-primary-h transition-colors ease-in-out duration-500 mb-2"
            >
              <div className="flex gap-4 justify-between">
                <div className="grow-0">
                  <img src={ImgixClient.buildURL(info.img, { w: 64, fm: 'jpg', q: 50 })} style={{ maxWidth: '64px' }} alt={info.name} />
                </div>
                <div className="flex flex-grow justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-sansLight text-secondary text-xs">Plot name</span>
                    <span className="font-sansLight text-fourth text-xs">{info.name.replace('Mortuary Inc ', '')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sansLight text-secondary text-xs">Free / Total slots</span>
                    <span className="font-sansLight text-fourth text-xs">
                      {info.freePlot} / {info.voxelBurnAccount.plotSize}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sansLight text-secondary text-xs">Per burn</span>
                    <span className="font-sansLight text-fourth text-xs">{info.hasBooster ? '+3' : '+2'} $ASH</span>
                  </div>
                  <span>
                    <a href={'/commons/' + info.voxelBurnAccount.mint} className="p-2 text-secondary">
                      ⟶
                    </a>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommonsList;
