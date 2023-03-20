import lexiconItems from 'features/Rarities/api/rarityItems.json';
import VideoLoop from 'components/VideoLoop';

interface LexProps {
  type: string;
}

const Lex = ({ type }: LexProps) => {
  return (
    <section className="col-span-4">
      {lexiconItems
        .filter((item) => item.attributes === type)
        .map((item, index) => {
          return (
            <div
              id={item.name.toLowerCase().replace(/\s/g, '-')}
              className="col-span-4 md:grid md:grid-cols-4 md:gap-8 mb-8 lg:mb-6"
              key={item.name.toLowerCase().replace(/\s/g, '-')}
            >
              <div className="mb-2 md:mb-0 md:col-span-2">
                <VideoLoop src={item.img} poster={''} w={716} />
              </div>
              <div className="md:col-span-2">
                <h3 className="">{item.name}</h3>
                <p className="font-sansLight">{item.description}</p>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default Lex;
