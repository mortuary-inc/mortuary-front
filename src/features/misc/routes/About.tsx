import { ReactComponent as TwitterSVG } from 'assets/twitter.svg';
import { ReactComponent as InstagramSVG } from 'assets/instagram.svg';
import { ReactComponent as GithubSVG } from 'assets/github.svg';
import { ReactComponent as YoutubeSVG } from 'assets/youtube.svg';
import SimpleButton from 'components/SimpleButton';
import PrimaryButton from 'components/PrimaryButton';
import { Routes } from 'routes/conf';
import StickyBox from 'react-sticky-box';
// Import Swiper React components
import SwiperCore, { Grid, Pagination, Scrollbar } from 'swiper';
import { scrollToID } from 'lib/utils';
// Import Swiper styles
// Styles must use direct files imports
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/grid';

import Rarities from 'features/Rarities/Rarities';
import ImageLoader from 'components/ImageLoader';

// install Swiper modules
SwiperCore.use([Grid, Pagination, Scrollbar]);

const About = () => {
  return (
    <>
      <main className="mt-16">
        <div className="lg:grid lg:grid-cols-6 lg:gap-8">
          <div className="lg:col-span-2 lg:flex lg:space-x-8 mb-8 lg:mb-0">
            <div>
              <h1 className="lg:mt-1 text-2xl sm:text-3xl font-serif font-extralight">About</h1>
            </div>
            <nav>
              <StickyBox offsetTop={20} offsetBottom={20}>
                <ul className="text-lg md:text-2xl lg:text-3xl font-sansLight space-x-2 md:space-x-8 lg:space-x-0 mt-2">
                  <li className="inline lg:block">
                    <button onClick={() => scrollToID('team')}>Team</button>
                  </li>
                  <li className="inline lg:block">
                    <button onClick={() => scrollToID('philosophy')}>Philosophy</button>
                  </li>
                  <li className="inline lg:block">
                    <button onClick={() => scrollToID('tokenomics')}>Tokenomics</button>
                  </li>
                  <li className="inline lg:block">
                    <button onClick={() => scrollToID('rarities')}>Rarities</button>
                  </li>
                  <li className="inline lg:block">
                    <button onClick={() => scrollToID('partners')}>Partners</button>
                  </li>
                </ul>
              </StickyBox>
            </nav>
          </div>
          <div className="lg:col-span-4">
            <section id="team" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="col-span-2 mb-8 md:mb-0 lg:mt-2">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Undertakers</h2>
                <p className="font-sansLight">
                  Mortuary Inc. is a family business operated from the Kingdom of Belgium by a team of NFT addicts backed up by an international squad of
                  digital mavericks.
                </p>
              </header>
              <div className="team-list col-span-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 text-center">
                <figure>
                  <ImageLoader
                    img="/assets/team/nypam.png"
                    alt="nypam profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Nypam</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Founder & Project Lead</p>
                      <p className="font-sansLight">Belgium</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <a
                        href="https://twitter.com/n_y_p_a_m"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                      <a
                        href="https://github.com/nypam"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubSVG className="inline cursor-pointer w-4" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
                <figure>
                  <ImageLoader
                    img="/assets/team/notsab.png"
                    alt="notsab profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Notsab</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Founder & Head of Content</p>
                      <p className="font-sansLight">Belgium</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <a
                        href="https://twitter.com/notsab_sol"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
                <figure>
                  <ImageLoader
                    img="/assets/team/matt.png"
                    alt="matt profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Matt</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Smart-Contract/Backend</p>
                      <p className="font-sansLight">France</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <span className="text-xs font-sansLight">Lives in the wood. Don't bother!</span>
                    </div>
                  </figcaption>
                </figure>
                <figure>
                  <ImageLoader
                    img="/assets/team/glitch.jpg"
                    alt="matt profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Glitchmob</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">DAO Management / Content Creator</p>
                      <p className="font-sansLight">United States</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                    <a
                        href="https://twitter.com/glitchsnob"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
                <figure>
                  <ImageLoader
                    img="/assets/team/clem.png"
                    alt="clem profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Clem</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Social Media Management</p>
                      <p className="font-sansLight">Belgium</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <a href="https://twitter.com/clmntlts" className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300">
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
                <figure className='opacity-50'>
                  <ImageLoader
                    img="/assets/team/kaikina.png"
                    alt="kaikina profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Kaikina</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Voxel Artist</p>
                      <p className="font-sansLight">France</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <a
                        href="https://twitter.com/kaikina_art"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                      <a
                        href="https://www.instagram.com/kaikina.art/"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramSVG className="inline cursor-pointer w-4" />
                      </a>
                      <a
                        href="https://www.youtube.com/user/Kaikinadevelopper"
                        className="w-5 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <YoutubeSVG className="inline cursor-pointer w-5" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
                <figure  className='opacity-50'>
                  <ImageLoader
                    img="/assets/team/brujo.png"
                    alt="brujo profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Brujo</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Rendering/Artist</p>
                      <p className="font-sansLight">United States</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <a
                        href="https://twitter.com/brujobeats"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                      <a
                        href="https://www.instagram.com/brujo.3d/"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramSVG className="inline cursor-pointer w-4" />
                      </a>
                      <a
                        href="https://www.youtube.com/channel/UCLJgKfuaf3q69MJ8WrOa-uw"
                        className="w-5 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <YoutubeSVG className="inline cursor-pointer w-5" />
                      </a>
                      <a
                        href="https://gitlab.com/Claytone"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubSVG className="inline cursor-pointer w-4" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
                
                <figure  className='opacity-50'>
                  <ImageLoader
                    img="/assets/team/fat.png"
                    alt="fat profile"
                    w={375}
                    classN="object-cover rounded-xl hover:opacity-75 transition-opacity ease-in-out duration-300"
                  />
                  <figcaption className="mt-3">
                    <p>Fatboulzor</p>
                    <div className=" text-sm">
                      <p className="font-sansLight">Partnerships and Community</p>
                      <p className="font-sansLight">Belgium</p>
                    </div>
                    <div className="social flex space-x-3 justify-center mt-2">
                      <a
                        href="https://twitter.com/FaTbOuLzzOr"
                        className="w-4 align-bottom hover:opacity-75 transition-opacity ease-in-out duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TwitterSVG className="inline cursor-pointer w-4" />
                      </a>
                    </div>
                  </figcaption>
                </figure>
              </div>
            </section>
            <section id="philosophy" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="md:col-span-3 mb-8 md:mb-0 lg:mt-4">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Mortuary's philosophy</h2>
                <p className="font-sansLight">
                  NFTs should be considered processes rather than products. The sooner all of us understand that, the healthier the Solana ecosystem will be.
                  You sell a product but you manage a process. You expect instant return when buying a product, you look for long-term use when embarking on a
                  process. Products divide us between have and have nots. Processes create communities of practices in which we learn and work together.
                  Products eventually hit obsolescence. Processes can grow beyond initial expectations. This clearly is our philosophy at Mortuary Inc.
                </p>
              </header>
            </section>
            <section id="tokenomics" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="md:col-span-3 mb-8 md:mb-0 lg:mt-4">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Tokenomics</h2>
                <p className="font-sansLight mb-4">
                  Solana ecosystem is clogged with daily launches of new NFT projects. While some make it to the moon, most of them will end up worthless. In
                  this overcrowded ecosystem, many users end up with lost investments and wallets overflowing with dead JPEGs. The rationale behind Mortuary
                  Inc. tokenomics is to implement circular economy principles to bring new value to those lost investments through recycling and repurposing
                  dead NFTs. At the center of this circular process is $ASH, the utility token fueling Mortuary Inc.’s ecosystem. How does that work? Well, glad
                  you asked!
                </p>
                <ul className="font-sans list-decimal list-inside lg:list-outside">
                  <li className="mb-4">
                    <p>
                      $ASH production is only possible through the NFT burning tool implemented by Mortuary Inc. The process allows users to destroy their NFTs
                      in exchange for a fixed amount of $ASH.
                    </p>
                  </li>
                  <li className="mb-4">
                    <p>
                      Different $ASH token mechanics and good-quality NFT projects will be released to incentivize users to spend $ASH. The collections mintable
                      with $ASH will eventually be tradable in SOL, bringing new values to users' lost investments.
                    </p>
                  </li>
                  <li className="mb-4">
                    <p>
                      $ASH spent by users will make its way back into Mortuary Inc.’s treasury, ensuring enough liquidity to maintain NFTs burning capacities.
                    </p>
                  </li>
                </ul>
                <p className="font-sansLight">
                  With that circular economy process in mind, Mortuary Inc. will closely monitor $ASH token production through burning to adapt the token market
                  cap (if needed) and correctly model launch rate of our partner collections, as well as their supply and mint price. This will ensure an
                  adequate circulation of $ASH between users and Mortuary Inc.
                </p>
              </header>
              <div className="md:col-span-2 md:text-right mb-8 md:mb-0">
                <div className="flex h-full space-x-2">
                  {/*<!-- <PrimaryButton link="#">Trade</PrimaryButton> -->*/}
                  <SimpleButton link="https://solscan.io/token/ASHTTPcMddo7RsYHEyTv3nutMWvK8S4wgFUy3seAohja#analysis" blank={true}>
                    Token Distribution
                  </SimpleButton>
                </div>
              </div>
            </section>
            {/*<!-- Section Rarities -->*/}
            <Rarities />
            <section id="partners" className="md:grid md:grid-cols-4 md:gap-8 mb-16 md:mb-32">
              <header className="col-span-2 mb-8 md:mb-0 lg:mt-4">
                <h2 className="text-2xl sm:text-3xl font-sansLight text-third mb-2">Partners</h2>
                <p className="font-sansLight">
                  Mortuary Inc is not only dedicated to clean the Solana ecosystem but also ambitions to promote talented artists. By turning dead NFTs into an
                  utility token, owners of our funeral plots and $ASH holders will have the opportunity to mint all our partner projects. The team will also
                  ensure that these partner collections will be listed on secondary markets and tradeable in $SOL. Utilities of partner collections will vary
                  and will not automatically be related to our funeral plots.
                </p>
              </header>
              <div className="col-span-2 md:text-right mb-8 md:mb-0">
                <div className="flex flex-col md:justify-end md:items-end h-full ">
                  <p className="font-sansLight w-3/4 mb-4">We are always looking for talented artists to join Mortuary Inc. program.</p>
                  <PrimaryButton alt={false} link={Routes.Partners}>
                    Become a partner
                  </PrimaryButton>
                </div>
              </div>
              <div className="col-span-4"></div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;
