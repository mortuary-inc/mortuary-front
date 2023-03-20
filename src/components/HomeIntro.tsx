import { useContext } from 'react';
import { ThemeContext } from './ThemeWrapper';
import SimpleButton from 'components/SimpleButton';
import { Routes } from 'routes/conf';
import { useLocation, NavLink } from 'react-router-dom';

const BodyMessage = () => {
  const darkMode = useContext(ThemeContext);
  const location = useLocation();

  return (
    <div>
    <div className={(darkMode ? 'text-secondary' : 'text-primary') + ' mt-8 sm:mt-14 md:w-4/5 lg:w-2/4 xl:w-3/5 m-auto text-center'}>
      <h2 className='font-sansLight text-xl mb-4 opacity-25'>The vision</h2>
      <div className='font-sansLight text-4xl mb-3'>Burn your dead NFTs to $ASH.<br/>With $ASH you buy 1/1 art.</div>
      <span className=''></span>
      <a href="https://discord.com/channels/@me/930424744564654090/1008389598864486401" className='nav-link relative font-sansLight text-sm hidden' target="_blank">Read the manifesto</a>
    </div>
    <div className='lg:w-2/4 mx-auto md:flex justify-between mt-8 mb-4'>
    <div className={'bg-fourth text-primary flex-col flex md:flex-row space-x-1 rounded-xl  text-2xl mb-4 mt-8 max-w-xs md:max-w-none mx-auto text-center'}>
      <NavLink activeClassName="selected" className={"shortcut rounded-xl py-2.5 px-3 font-sans leading-8 hover:bg-fourth-h hover:text-primary-h"} to={Routes.MyMortuary}>Burn trash</NavLink>
    </div>
    <div className={'bg-grayDark text-secondary md:flex md:flex-row md:space-x-1 rounded-xl  text-2xl mb-4 mt-8 max-w-xs md:max-w-none mx-auto text-center'}>
      <NavLink activeClassName="selected" className={"shortcut block md:inline rounded-xl py-2.5 px-3 font-sansLight leading-8 hover:bg-black hover:text-third hover:bg-opacity-25"} to={Routes.Cleaner}>Wallet cleaner</NavLink>
      <a className={"shortcut block md:inline rounded-xl py-2.5 px-3 font-sansLight leading-8 hover:bg-black hover:text-third hover:bg-opacity-25"} href={"https://famousfoxes.com/tokenmarket/Ash"} target={"_blank"}>Trade $ASH</a>
    </div>
    </div>
    
    </div>
  );
};

export default BodyMessage;
