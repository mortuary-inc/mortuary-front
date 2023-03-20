import PrimaryButton from 'components/PrimaryButton';
import SwiperCore, { Navigation } from 'swiper';

import 'swiper/css';
// install Swiper modules
SwiperCore.use([Navigation]);

const About = () => {
  return (
    <>
      <main className="mt-16">
        <header id="partners" className="grid md:grid-cols-6 md:gap-8 pb-16">
          <div className="md:col-span-3 lg:col-span-3 mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-serif font-extralight mb-3">Partners</h1>
            <p className="font-sansLight mb-4">
              Mortuary Inc is not only dedicated to clean the Solana ecosystem but also ambitions to promote talented artists. By turning dead NFTs into an
              utility token, owners of our funeral plots and $ASH holders will have the opportunity to mint all our partner projects. The team will also ensure
              that these partner collections will be listed on secondary markets and tradeable in $SOL. Utilities of partner collections will vary and will not
              automatically be related to our funeral plots.
            </p>
          </div>
          <div className="md:col-span-3 lg:col-span-3 xl:col-span-2 xl:col-end-7 md:text-right">
            <div className="flex flex-col md:justify-end md:items-end h-full ">
              <p className="font-sansLight w-3/4 mb-4">We are always looking for talented artists to join Mortuary Inc.</p>
              <PrimaryButton alt={false} link={'https://forms.gle/Bj9sEyQVwGZ3pwPb9'} blank={true}>
                Become a partner
              </PrimaryButton>
            </div>
          </div>
        </header>
      </main>
    </>
  );
};

export default About;
