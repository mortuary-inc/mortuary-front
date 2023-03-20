import { useState } from 'react';

// Import Swiper React components
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import H2 from 'components/H2';

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const Expandable = () => {
  const [isOpen, setActive] = useState<boolean>(false);

  const handleToggle = () => {
    setActive(!isOpen);
  };
  return (
    <>
      <section className="pb-16 bg-secondary">
        <article className={(isOpen ? 'opened bg-primary' : '') + ' selected lg:px-8'}>
          <div className="max-w-7xl m-auto px-4 lg:px-0">
            <header
              className={(isOpen ? 'bg-primary text-secondary mb-8 lg:mb-16' : 'bg-secondary-h') + ' relative lg:grid lg:grid-cols-6 lg:gap-8 rounded-xl '}
            >
              <div className="relative col-span-1 md:col-span-3 lg:col-span-6 xl:col-span-3 md:flex xl:space-x-8 md:items-end">
                <img
                  src="../assets/minions/mortuary-inc-coyote-teaser.png"
                  alt="Mortuary Minions Teaser by Coyote"
                  className={
                    (isOpen ? 'transform -translate-y-5' : '') +
                    '  w-1/3 lg:w-1/4 xl:w-1/3 rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300'
                  }
                />
                <div className="md:hidden absolute top-4 right-4 flex items-end font-sansLight text-sm justify-end md:pr-8">
                  <button className="flex justify-between space-x-2" onClick={handleToggle}>
                    <p className="my-auto ml-3">{isOpen ? 'Less info' : 'More info'}</p>
                    <p className={(isOpen ? 'border-secondary' : 'border-primary') + ' mt-auto border rounded-2xl px-3 py-0 pt-1 text-md'}>⟶</p>
                  </button>
                </div>
                <div className="px-4 lg:px-8 xl:px-0 pt-4 md:pt-0 lg:flex lg:flex-col lg:justify-end pb-4 lg:w-2/5 xl:w-full">
                  <H2 className="w-full">Mortuary Minions</H2>
                  <p className="w-ful text-2xl xl:text-3xl font-serif opacity-50">A collection of 1250 funky skeletons serving as booster for Mortuary Inc.</p>
                </div>
              </div>
              <div className="px-4 lg:px-8 xl:px-0 md:col-span-3 grid md:grid-cols-4 lg:gap-4 pb-4 md:absolute md:w-2/3 lg:w-3/4 xl:w-full xl:relative top-4 right-0 xl:inset-0">
                <div className="col-span-3 lg:col-span-3 lg:gap-4 flex items-end">
                  <div className="w-1/3">
                    <p className="text-xs uppercase">Artist</p>
                    <p className="font-serif text-xl opacity-50">Coyote</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-xs uppercase">Date</p>
                    <p className="font-serif text-xl opacity-50">20.01.22</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-xs uppercase">Price</p>
                    <p className="font-serif text-xl opacity-50">60 $ASH</p>
                  </div>
                </div>
                <div className="hidden md:flex col-span-1 items-end font-sansLight text-sm justify-end lg:pr-4">
                  <button className="lg:flex justify-between space-x-2" onClick={handleToggle}>
                    <p className="my-auto ml-3 lg:ml-0">{isOpen ? 'Less info' : 'More info'}</p>
                    <p className={(isOpen ? 'border-secondary' : 'border-primary') + ' mt-auto border rounded-2xl px-3 py-0 pt-1 text-md'}>⟶</p>
                  </button>
                </div>
              </div>
            </header>
            <div className={isOpen ? 'visible' : 'hidden'}>
              <div className={(isOpen ? 'text-secondary' : '') + ' grid grid-cols2 lg:grid-cols-6 gap4 lg:gap-8 pb-8'}>
                <div className="px-4 lg:px-0 col-span-3 mb-8 lg:mb-0">
                  <h3>About Coyote</h3>
                  <p className="font-sansLight mb-4">
                    Coyote is a cartoon director, animator and character designer working in LA and he joined the Mortuary Inc. family to present art of another
                    genre, never seen before in Solana.{' '}
                  </p>
                  <h3>About Mortuary Minions</h3>
                  <p className="font-sansLight mb-4">
                    An army of 1250 degenerate zombies, rotten corpses and other weird skeletons serving as boosters for your Mortuary Inc. funeral plots. Each
                    Mortuary Minion is uniquely and artfully hand-drawn by combining 6 main and 11 bonus attributes. These come in five different rarities
                    (common, uncommon, rare, epic and legendary) but are all as crazy and visually stunning as it gets.
                  </p>
                  <h3>Perks and benefits</h3>
                  <ul className="list-disc font-sansLight mb-8">
                    <li>You get an amazing pfp. Everyone will be jealous, it’s a fact!</li>
                    <li>
                      Holding a Mortuary Minion in the same wallet as your funeral plot will improve its burning performances, granting you now 5 $ASH per burn
                      instead of 3.{' '}
                    </li>
                    <li>A Mortuary Minion can also be burnt at any time to earn 100 $ASH making the collection deflationary.</li>
                  </ul>
                  <div className="col-span-2 flex gap-8">
                    <div className="">
                      <p className="text-xs uppercase">Twitter</p>
                      <p className="font-serif text-xl opacity-50">
                        <a href="https://twitter.com/986Coyote" target="_blank" rel="noreferrer">
                          @Coyote
                        </a>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs uppercase">Secondary marketplace</p>
                      <p className="font-serif text-xl opacity-50">
                        <a href="https://www.magiceden.io/marketplace/mortuary_minions" target="_blank" rel="noreferrer">
                          MagicEden
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <Swiper slidesPerView={'auto'} spaceBetween={10} navigation={true} pagination={true} className="mySwiper partners">
                    <SwiperSlide>
                      <img src="../assets/minions/mortuary-inc-coyote-minions-01.png" alt="Mortuary Inc. Minions by Coyote" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="../assets/minions/mortuary-inc-coyote-minions-02.png" alt="Mortuary Inc. Minions by Coyote" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="../assets/minions/mortuary-inc-coyote-minions-03.png" alt="Mortuary Inc. Minions by Coyote" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="../assets/minions/mortuary-inc-coyote-minions-04.png" alt="Mortuary Inc. Minions by Coyote" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img src="../assets/minions/mortuary-inc-coyote-minions-05.png" alt="Mortuary Inc. Minions by Coyote" />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default Expandable;
