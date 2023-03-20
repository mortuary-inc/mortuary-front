import { Fragment, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import rarityItems from './api/rarityItems.json';
import SimpleButton from 'components/SimpleButton';
import { Routes } from 'routes/conf';
import VideoLoop, { pauseVideo, playVideo } from 'components/VideoLoop';

const filters = ['All', 'Buildings', 'Artifacts', 'Biome', 'Weather', 'Fauna'];

const Rarities = () => {
  const [filter, setFilter] = useState('');
  const [videosRef, setVideosRef] = useState<{ [key: string]: React.RefObject<HTMLVideoElement> }>({});

  const handleFilter = (_filter: string) => {
    if (_filter === 'All') _filter = '';

    setFilter(_filter);
  };

  return (
    <section id="rarities" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
      <header className="col-span-2 mb-8 md:mb-0 lg:mt-4">
        <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Rarities</h2>
        <p className="font-sansLight">
          All of Mortuary Inc funeral plots are uniquely and beautifully crafted. They also have the same core utilities. They nonetheless differ in terms of
          rarity on the basis of five sets of attributes: buildings, artifacts, biome, weather, and fauna.
        </p>
      </header>
      <div className="md:col-span-2 md:text-right mb-8 md:mb-0">
        <div className="flex md:justify-end md:items-end h-full space-x-2">
          <SimpleButton link={Routes.Lexicon}>Lexicon</SimpleButton>
        </div>
      </div>
      <div className="col-span-4">
        <div className="md:grid md:grid-cols-4 md:gap-8">
          <div className="mb-8 md:mb-0">
            {filters.map((_filter, index) => (
              <button
                key={`RarityFilter-${index}`}
                onFocus={() => handleFilter(_filter)}
                className="mt-2 rounded-xl bg-secondary-h text-center p-1 md:p-5 w-full text-primary-h border-4 border-secondary-h focus:border-gray-600 focus:border-opacity-20"
              >
                {_filter}
              </button>
            ))}
          </div>
          <div className="col-span-3">
            <Swiper
              scrollbar={{ hide: false, draggable: true, snapOnRelease: true }}
              direction={'vertical'}
              slidesPerView={2}
              grid={{ rows: 2 }}
              spaceBetween={24}
              className="rarities"
            >
              {rarityItems
                .sort((a) => a.rarity)
                .map((item, index) => {
                  if (filter && item.attributes !== filter) return <Fragment key={`Rarity-${index}`}></Fragment>;

                  //console.debug(item.img);
                  const keyRef = `video-${index}`;
                  return (
                    <SwiperSlide key={`Rarity-${index}`} onMouseOver={() => playVideo(videosRef[keyRef])} onMouseOut={() => pauseVideo(videosRef[keyRef])}>
                      <div className={` h-full w-full bg-white rounded-xl relative shadow-md overflow-hidden`}>
                        <VideoLoop src={item.img} poster={''} name={keyRef} setVideosRef={setVideosRef} w={335} />

                        <div
                          className={
                            (item.attributes === 'Biome' ? 'text-secondary' : '') +
                            ' infoBox absolute w-full top-0 left-0 flex h-full items-end p-4 rounded-xl text-sm xl:text-base'
                          }
                        >
                          <p className="font-sans">{item.name}</p>
                          <p className="font-sansLight flex-1 text-right">
                            {item['rarity-text']} {item.rarity} %
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rarities;
