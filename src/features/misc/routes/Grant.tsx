import PrimaryButton from 'components/PrimaryButton';

const Grant = () => {
  return (
    <>
      <main className="mt-16">
        <div className="lg:grid lg:grid-cols-6 lg:gap-8">
          <div className="lg:col-span-2 lg:flex lg:space-x-8 mb-8 lg:mb-0">
            <div>
              <h1 className="lg:mt-1 text-2xl sm:text-3xl font-serif font-extralight">Grant</h1>
              <div className="mt-8">
                <p className="font-sansLight w-3/4 mb-4">We are always looking for talented artists to join Mortuary Inc. grant program.</p>
                <PrimaryButton alt={true} link={'https://forms.gle/7rmEUdz3BrLH5wky9'}>
                  Apply for a grant
                </PrimaryButton>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <section id="partners" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="col-span-3 mb-8 md:mb-0 mt-2">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Rise from the ashes...</h2>
                <p className="font-sansLight mb-4">
                  In line with its initiative to launch partner collections to be minted with $ASH, its utility token, Mortuary Inc. presents its first public
                  Mortuary Grant. This funding, ranging from 15 to 30 SOL depending on the project requirements and Solana valuation, will be allocated to a
                  talented artist who wants to launch his/her own NFT collection on Solana.
                </p>
                <p className="font-sansLight  mb-4">
                  While striving to clean the Solana ecosystem from as many of its dead NFTs as possible, Mortuary Inc. also intends to fuel qualitative
                  initiatives and help artists embark on the Web3 adventure.
                </p>
                <p className="font-sansLight  mb-4">The selection will be a two stages process:</p>
                <div className="md:grid md:grid-cols-2 text-center gap-8 mb-8">
                  <div className="rounded-xl bg-primary p-8 md:min-h-64 md:col-span-1 flex flex-col justify-center mb-4 md:mb-0">
                    <p className="font-serif text-fourth text-2xl mb-2 ml-2">1.</p>
                    <p className="text-third mb-4">Mortuary Inc. team will review all applications and short-list some of them.</p>
                    <p className="font-sansLight text-secondary text-xs">
                      <span className="uppercase">Timing: </span>1-2 weeks
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary p-8 md:min-h-64 md:col-span-1 flex flex-col justify-center">
                    <p className="font-serif text-fourth text-2xl mb-2 ml-2">2.</p>
                    <p className="text-third mb-4">Mortuary DAO will review all short-listed projects and vote for the attribution of the grant.</p>
                    <p className="font-sansLight text-secondary text-xs">
                      <span className="uppercase">Timing: </span>Vote open for 1 week
                    </p>
                  </div>
                </div>
                <p className="font-sansLight  mb-4">
                  To insure the safety of all, Mortuary Inc. will require that the recipient goes through a thorough doxing with {''}
                  <a href={'https://www.proofofpizza.io/'} className="underline-purple" target="_blank" rel="noreferrer">
                    Proof of Pizza
                  </a>
                  . After completion of the project and before launch, it will also be submitted to a {''}
                  <a href={'https://www.radrugs.io/'} className="underline-purple" target="_blank" rel="noreferrer">
                    RadRugs
                  </a>{' '}
                  premium audit.
                </p>
              </header>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Grant;
