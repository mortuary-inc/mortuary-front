import StickyBox from 'react-sticky-box';
import Lex from 'features/Lexicon/Lex';
import Dropdown from 'components/Dropdown';
import lexiconItems from 'features/Rarities/api/rarityItems.json';
const Lexicon = () => {
  return (
    <>
      <main className="mt-16">
        <div className="lg:grid lg:grid-cols-6 lg:gap-8">
          <div className="lg:col-span-2 lg:flex lg:space-x-8 mb-8 lg:mb-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-extralight mb-2 md:mb-0">Lexicon</h1>
            </div>
            <nav>
              <StickyBox offsetTop={20} offsetBottom={20}>
                <ul className="lg:mt-1 text-lg md:text-2xl lg:text-3xl font-sansLight space-x-2 sm:space-x-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-none">
                  <li className="inline lg:block">
                    <a href="#buildings">Buildings</a>
                    <div className="relative block lg:inline-flex mt-1 md:mt-2 mb-4 w-full">
                      <Dropdown options={lexiconItems.filter((item) => item.attributes === 'Buildings')} />
                      <svg className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 232">
                        <path
                          d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                          fill="#648299"
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                  </li>
                  <li className="inline lg:block mt-2 sm:mt-0">
                    <a href="#artifacts">Artifacts</a>
                    <div className="relative block lg:inline-flex mt-1 md:mt-2 mb-4 w-full">
                      <Dropdown options={lexiconItems.filter((item) => item.attributes === 'Artifacts')} />
                    </div>
                  </li>
                  <li className="inline lg:block mt-2 sm:mt-0">
                    <a href="#artifacts">Fauna</a>
                    <div className="relative block lg:inline-flex mt-1 md:mt-2 mb-4 w-full">
                      <Dropdown options={lexiconItems.filter((item) => item.attributes === 'Fauna')} />
                    </div>
                  </li>
                </ul>
              </StickyBox>
            </nav>
          </div>
          <div className="lg:col-span-4">
            <section id="buildings" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="col-span-2 mb-8 md:mb-0">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Buildings</h2>
              </header>
              <Lex type={'Buildings'} />
            </section>
            <section id="artefacts" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="col-span-2 mb-8 md:mb-0">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Artifacts</h2>
              </header>
              <Lex type={'Artifacts'} />
            </section>
            <section id="artefacts" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="col-span-2 mb-8 md:mb-0">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Fauna</h2>
              </header>
              <Lex type={'Fauna'} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Lexicon;
