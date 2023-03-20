import { scrollToID } from 'lib/utils';
import { roadmapID } from 'features/Roadmap/RoadmapDetails';

const Roadmap = () => {
  return (
    <>
      <main className="mt-16">
        <div className="sm:grid sm:grid-cols-6 lg:grid-cols-4 md:gap-8">
          <div className="sm:col-start-2 sm:col-span-4 lg:col-start-2 lg:col-span-2 text-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-extralight">Roadmap</h1>
              <p className="font-sansLight w-2/3 m-auto mb-2">
                Death is only the beginning. <br />
                Mortuary Inc has a lot of things up its sleeves for all its apprentices and gravediggers. Let's have a peek at what's awaiting down the road...!{' '}
              </p>
              <button
                className="border-primary hover:bg-primary hover:text-secondary border rounded-2xl font-sans px-4 py-1 pt-2 inline-block  transition-colors duration-200 ease-in-out"
                onClick={() => scrollToID(roadmapID)}
              >
                Take me there
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Roadmap;
