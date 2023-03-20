import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from 'components/ThemeWrapper';
import { NavLink, useLocation } from 'react-router-dom';
import { Routes } from 'routes/conf';
import { Menu, Transition } from '@headlessui/react';
import { ReactComponent as HamSVG } from 'assets/hamburger.svg';

interface MenuProps {
  visible: boolean;
  forceHidden?: boolean;
}

const MenuNav = ({ visible, forceHidden }: MenuProps) => {
  const darkMode = useContext(ThemeContext);
  const location = useLocation();
  const [isHomepage, setIsHomepage] = useState(true);
  const [menuItems, setMenuItems] = useState([["","", "", ""]]);


  useEffect(() => {
    location.pathname === '/' ? setIsHomepage(true) : setIsHomepage(false);
    if(isHomepage){
      setMenuItems([['About', Routes.About],['Partners', Routes.Partners],['My Mortuary', Routes.MyMortuary],['Cleaner', Routes.Cleaner]])
    } else {
      setMenuItems([['About', Routes.About],['Partners', Routes.Partners]])
    }
  }, [location, isHomepage]);

  return (
    <>
      <nav
        className={
          (visible ? 'block' : 'hidden') +
          (darkMode ? ' text-primary md:text-secondary' : ' text-primary') +
          (isHomepage ? ' mt-16' : ' md:text-left') +
          (forceHidden ? ' hidden md:block' : '') +
          ' main-nav md:hidden bg-secondary-h md:bg-transparent md:space-x-2 font-sansLight text-base md:mt-8 lg:mt-1 text-center lg:text-center rounded-t-xl md:rounded-none'
        }
      >
        {menuItems.map(([title, url]) => (
          <NavLink key={title} activeClassName="selected" className={(darkMode ? '' : '') + ' w-full block md:inline px-1 lg:px-3 py-2 nav-link'} to={url}>
            {title}
          </NavLink>
        ))}
        <NavLink
          key="contact"
          activeClassName="selected"
          className={(darkMode ? '' : '') + ' w-full block md:inline px-1 lg:px-3 py-2 nav-link'}
          to={{ pathname: 'https://discord.gg/sMUu9REvU8' }}
          target="_blank"
        >
          Contact
        </NavLink>
      </nav>
      <Menu  as="div" className={' ham-menu hidden relative md:inline-block text-left mr-4'}>
      <Menu.Button  className={(darkMode ? ' darkMode bg-grayDark hover:bg-black hover:bg-opacity-25' : ' bg-secondary-h hover:bg-secondary-h2') + ' rounded-xl py-2.5 px-3 font-sans leading-5  hover:text-third '}> <HamSVG className="inline cursor-pointer" /></Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
      <Menu.Items className={(darkMode ? 'bg-secondary' : 'bg-grayDark') + ' absolute right-0 mt-2 w-56 origin-top-right rounded-xl shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none p-1 z-50'}>
        {menuItems.map(([title, url]) => (
          <Menu.Item key={title+"1"}>
            {({ active }) => (
              <NavLink key={title + "-desktop"} activeClassName="selected" className={(darkMode ? 'text-gray-900 hover:bg-black hover:bg-opacity-25' : 'text-secondary hover:bg-primary') + ' hamburger  group flex w-full items-center  rounded-xl py-2.5 px-3'} to={url}>
              {title}
            </NavLink>
   
                )}
          </Menu.Item>
        ))}
        <Menu.Item key={"contact1"}>
            {({ active }) => (
              <NavLink
              key="contact-desktop"
              activeClassName="selected"
              className={(darkMode ? 'text-gray-900 hover:bg-black hover:bg-opacity-25' : 'text-secondary hover:bg-primary') + ' hamburger  group flex w-full items-center  rounded-xl py-2.5 px-3'}
              to={{ pathname: 'https://discord.gg/sMUu9REvU8' }}
              target="_blank"
            >
              Contact
            </NavLink>
   
                )}
          </Menu.Item>
        
      </Menu.Items>
      </Transition>
    </Menu>
    </>
  );
};

export default MenuNav;
