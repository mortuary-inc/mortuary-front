
import { useContext, useEffect, useState } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import Connect from 'features/Connect/Connect';
import { ThemeContext } from './ThemeWrapper';
import MenuNav from './MenuNav';
import LogoText from './LogoText';
import { Routes } from 'routes/conf';

const TopLink = () => {
  const darkMode = useContext(ThemeContext);
  const location = useLocation();
  const [isHomepage, setIsHomepage] = useState(true);

  const [isOpen, setActive] = useState<boolean>(false);

  const handleToggle = () => {
    setActive(!isOpen);
  };

  useEffect(() => {
    location.pathname === '/' ? setIsHomepage(true) : setIsHomepage(false);
  }, [location, isOpen]);

  return (
    <div className={(darkMode ? 'text-secondary' : 'text-primary') + (isHomepage ? ' justify-end' : '') + ' relative md:flex font-sansLight'}>
      <div className={(isHomepage ? 'md:hidden' : 'lg:flex') + '  flex-1 justify-left pt-4'}>
        <LogoText />
        <button
          className={
            (darkMode ? 'border-secondary hover:bg-secondary hover:text-primary' : 'border-primary hover:bg-primary hover:text-secondary') +
            ' absolute top-4 right-0 md:hidden border rounded-2xl font-sans px-4 py-1 pt-2 inline-block  transition-colors duration-200 ease-in-out'
          }
          onClick={handleToggle}
        >
          Menu
        </button>
      </div>
      <div
        className={
          (isOpen ? 'block' : 'hidden') +
          ' md:flex flex-0 place-content-end rounded-xl bg-secondary-h md:bg-transparent md:rounded-none mt-4 pb-4 md:pb-0 md:pt-3 flex-col-reverse md:flex-row md:mt-0'
        }
      >
        <MenuNav visible={isOpen} />
        <div className={
            (darkMode ? 'bg-grayDark text-secondary' : 'bg-secondary-h text-primary') +
            (isHomepage ? ' hidden' : '') +
            ' flex-col flex md:flex-row space-x-1 rounded-xl  mb-4 mt-4 md:mt-0 md:mr-4 max-w-xs md:max-w-none mx-auto text-center'
          }>
          <NavLink activeClassName="selected" className={"shortcut rounded-xl py-2.5 px-3 font-sans leading-5" + (darkMode ? ' hover:bg-black hover:text-third hover:bg-opacity-25' : ' hover:bg-black hover:text-primary hover:bg-opacity-10')} to={Routes.MyMortuary}>My Mortuary</NavLink>
          <NavLink activeClassName="selected" className={"shortcut rounded-xl py-2.5 px-3 font-sans leading-5" + (darkMode ? ' hover:bg-black hover:text-third hover:bg-opacity-25' : ' hover:bg-black hover:text-primary hover:bg-opacity-10')} to={Routes.Cleaner}>Wallet Cleaner</NavLink>
          </div>
        <Connect />
      </div>
    </div>
  );
};

export default TopLink;

/* <div className={(isHomepage ? 'hidden' : '') + ' lg:flex flex-1 justify-left pt-4'}> */
