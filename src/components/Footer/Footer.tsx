import { ReactComponent as DiscordSVG } from 'assets/discord.svg';
import { ReactComponent as TwitterSVG } from 'assets/twitter.svg';
import { ThemeContext } from 'components/ThemeWrapper';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Routes } from 'routes/conf';
import stylesX from './Footer.module.css';

const Footer = () => {
  const darkMode = useContext(ThemeContext);

  return (
    <div className={(darkMode ? 'text-secondary' : 'text-primary') + ' font-sansLight text-xs sm:text-sm pt-14 sm:pt-28 pb-3'}>
      <div className="text-2xl mb-8 mx-auto text-center">
        <p className="font-serif">Death is only the beginning...</p>
      </div>
      <div className={' flex justify-between '}>
        <p className="mt-auto">All Rights Reserved 2021</p>
        <div className="footer-module">
          <div className={(darkMode ? stylesX.darkMode : stylesX.svg) + ' text-right'}>
            <a href={"https://discord.gg/sMUu9REvU8"}>
              <DiscordSVG className="inline m-2 cursor-pointer" />
            </a>
            <a href={"https://twitter.com/MortuaryIncNFT"}>
              <TwitterSVG className="inline m-2 cursor-pointer" />
            </a>
          </div>
          <Link className="underline-purple" to={Routes.TermCondition}>
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
