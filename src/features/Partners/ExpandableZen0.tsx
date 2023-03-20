import { useState } from 'react';

// Import Swiper React components
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import H2 from 'components/H2';

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const ExpandableZen0 = () => {
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
                  src="../assets/zen0/circle-thumbnail-500x500.gif"
                  alt="Zen0verse Unearthed Banner by zen0"
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
                  <H2 className="w-full">Zen0verse Unearthed</H2>
                  <p className="w-ful text-2xl xl:text-3xl font-serif opacity-50">
                    An exclusive collection of 32 banners telling stories of eerie and otherworldly places.{' '}
                  </p>
                </div>
              </div>
              <div className="px-4 lg:px-8 xl:px-0 md:col-span-3 grid md:grid-cols-4 lg:gap-4 pb-4 md:absolute md:w-2/3 lg:w-3/4 xl:w-full xl:relative top-4 right-0 xl:inset-0">
                <div className="col-span-3 lg:col-span-3 lg:gap-4 flex items-end">
                  <div className="w-1/3">
                    <p className="text-xs uppercase">Artist</p>
                    <p className="font-serif text-xl opacity-50">Zen0</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-xs uppercase">Date (starting)</p>
                    <p className="font-serif text-xl opacity-50">18.02.22</p>
                  </div>
                  <div className="w-1/3">
                    <p className="text-xs uppercase">Price</p>
                    <p className="font-serif text-xl opacity-50">Auction</p>
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
                  <h3>About Zen0</h3>
                  <p className="font-sansLight mb-4">
                    Zen0 is an independent artist on Solana with a background in Art Direction for the games industry. He creates atmospheric pixel art
                    environments and characters throughout collections of both 1/1 and generative art.{' '}
                  </p>
                  <h3>About Zen0verse Unearthed</h3>
                  <p className="font-sansLight mb-4">
                    In their relentless pursuit of the great cleanse of Solana ecosystem, Mortuary Inc. Undertakers may have dug a bit too far... Way under the
                    surface of their plots, they unearthed a secret complex of tunnels and hidden caves. A whole other section of the Zen0verse is revealed.
                  </p>
                  <p className="font-sansLight mb-4">
                    Find, in each banner, the biomes and sprites at the core of the Zen0verse and witness how $ASH brings back to life long-forgotten designs
                    and never-seen color palettes. Behold these marvels, get lost in these tiny worlds, witness legends in the making, enter Zen0verse
                    Unearthed.{' '}
                  </p>
                  <p className="font-sansLight mb-4">
                    Zen0verse Unearthed is a very exclusive collection of 32 banners (24 still and 8 animated) or masterfully hand-drawn by artist @zen0m,
                    renowned for his atmospheric art pieces inspired by classic video games, to be auctioned in $ASH.
                  </p>
                  <h3>Perks and benefits</h3>
                  <ul className="list-disc font-sansLight mb-8">
                    <li>You get one of the most sought-after art pieces as your Twitter or Discord header.</li>
                    <li>You become an integral part of the very selective Zen0verse.</li>
                  </ul>
                  <div className="col-span-2 flex gap-8">
                    <div className="">
                      <p className="text-xs uppercase">Twitter</p>
                      <p className="font-serif text-xl opacity-50">
                        <a href="https://twitter.com/zen0m" target="_blank" rel="noreferrer">
                          @zen0m
                        </a>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-xs uppercase">Secondary marketplace</p>
                      <p className="font-serif text-xl opacity-50">
                        <a href="https://exchange.art/collections/Zen0verse%20Unearthed" target="_blank" rel="noreferrer">
                          Exchange.art
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <img src="../assets/zen0/zen0verse-unearthed-08.png" alt="Mortuary Inc. Minions by Coyote" />
                  <img src="../assets/zen0/zen0verse-unearthed-09.png" alt="Mortuary Inc. Minions by Coyote" />
                  <img src="../assets/zen0/zonemap-02b.png" alt="Mortuary Inc. Minions by Coyote" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ExpandableZen0;
