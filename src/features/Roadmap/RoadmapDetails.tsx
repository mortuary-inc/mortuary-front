import Fade from "components/Fade";
// import Fade from 'react-reveal/Fade';

export const roadmapID = 'roadmapID';

const RoadmapDetails = () => {
  return (
    <div className="sm:grid md:grid-cols-5 lg:grid-cols-6 text-center">
      <div id={roadmapID} className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16  roadmap-list">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 0 — December 2021 </span>
          <h3 className="font-serif text-3xl text-third mb-2">The Funerary Pyre</h3>
          <p className="text-secondary font-sansLight">
            Mortuary Inc. opens its gates and launches its proof-of-concept burning tool: burn 1 dead NFT every 8 hours in exchange for 3 $ASH.
          </p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 1 — January 8, 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">The Deathly mint</h3>
          <p className="text-secondary font-sansLight">
            A collection of 2500 voxel funeral plots NFTs is released. Be the master of your exclusive Funeral Home. Burn and bury those mistakes of the past,
            no question asked! Exclusive listing on Magic Eden right after mint.
          </p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 2 — January 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">The Funeral Parlor</h3>
          <p className="text-secondary font-sansLight">Showcase your dead NFTs and write epitaphs in their memory or curse them forever.</p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 3 — January 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">The Crematorium</h3>
          <p className="text-secondary font-sansLight">Burn multiple dead NFTs simultaneously in exchange for 5 $ASH each.</p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 4 — End of January 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">Rebirth of the Mortuary Minions</h3>
          <p className="text-secondary font-sansLight">
            The Mortuary Minions are unleashed. Mint them with $ASH exclusively. Grab yours to boost the efficiency of your voxel funeral plot.
          </p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 5 — Q1 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">The Mortuary Commons</h3>
          <p className="text-secondary font-sansLight">
            Invite friends and family over to benefit from the utilities of your funeral plot and mourn your dead NFTs together. Listing of $ASH on Dex Lab.
          </p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 6 — Q2 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">Burial and Undeath</h3>
          <p className="text-secondary font-sansLight">
            Bury dead NFTs for an increasing weekly chance to revive a Ghoul. Stake $ASH to make the corpses rot faster. Feed your Ghoul dead NFTs to make it
            evolve.
          </p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">Phase 7 — Q3 2022 </span>
          <h3 className="font-serif text-3xl text-third mb-2">Play with the Dead</h3>
          <p className="text-secondary font-sansLight">
            Gamification of the burning and burying utilities. If you are getting rid of your trash, you might just as well have some fun while doing it.{' '}
          </p>
        </Fade>
      </div>
      <div className="col-span-4 col-start-2 md:col-start-2  md:col-span-3 lg:col-start-3 lg:col-span-2 mb-8 lg:mb-16">
        <Fade bottom>
          <span className="uppercase text-fourth text-sm font-sansLight">What’s next ? </span>
          <h3 className="font-serif text-3xl text-third mb-2">Deadly Alliances !</h3>
          <p className="text-secondary font-sansLight">
            Release of at least one partner collection mintable with $ASH per quarter. More $ASH utilities revealed.
          </p>
        </Fade>
      </div>
    </div>
  );
};

export default RoadmapDetails;
