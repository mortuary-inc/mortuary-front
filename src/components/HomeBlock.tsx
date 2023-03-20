import H2 from 'components/H2';
import { Routes } from 'routes/conf';

import SimpleButton from 'components/SimpleButton';
import cemeteryImg from 'assets/cemetery.png';

const HomeBlock = () => {
  return (
    <>
      <section className="md:flex md:space-x-4 lg:space-x-8 items-center bg-secondary">
        <div className="text-center mx-auto w-5/6 md:w-1/2 mb-8 md:mb-0">
          <img className="md:w-auto relative m-auto" src={cemeteryImg} alt="Grave" />
        </div>
        <div className="md:w-1/2 text-center md:text-left text-primary py-8 md:pb-8">
          <H2>Death is only the beginning</H2>
          <p className="font-sansLight xl:w-5/6 mb-4">
            Our project aims at cleaning the Solana ecosystem of all its rugs while giving value to dead NFTs. When you burn, you earn $ASH (our utility token).
            $ASH will be used to mint exclusive NFT collections from our{' '}
            <a href={Routes.Partners} className="underline-purple">
              Partners
            </a>{' '}
            and to improve the efficiency of our funeral plots. On top of that, it will also give access to the{' '}
            <a href="https://discord.gg/Hwftje9ZC3" className="underline-purple" target="_blank" rel="noreferrer">
              Mortuary Dao
            </a>{' '}
            and will likely have further utilities along the way…{' '}
          </p>
          <SimpleButton link={Routes.Roadmap} light={true}>
            Check the Roadmap
          </SimpleButton>
        </div>
      </section>
    </>
  );
};

export default HomeBlock;
