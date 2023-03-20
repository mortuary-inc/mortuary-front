import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeWrapper';
import { Link } from 'react-router-dom';
import { Routes } from 'routes/conf';

const Logo = () => {
  const darkMode = useContext(ThemeContext);
  const [imageLogo, setImageLogo] = useState();
  const [imageUnderLogo, setImageUnderLogo] = useState();
  const [imageLogoMobile, setImageLogoMobile] = useState();
  const [imageUnderLogoMobile, setImageUnderLogoMobile] = useState();
  const pathLogo = 'skull-logo';
  const pathUnderLogo = 'mortuaryInc';
  const darkAdd = '-dark';

  useEffect(() => {
    const darkPath = darkMode ? darkAdd : '';
    import(`assets/${pathLogo + darkPath}.png`).then((image) => {
      setImageLogo(image.default);
    });
    import(`assets/${pathUnderLogo + darkPath}.png`).then((image) => {
      setImageUnderLogo(image.default);
    });

    import(`assets/${pathLogo + darkPath}-mobile.png`).then((image) => {
      setImageLogoMobile(image.default);
    });
    import(`assets/${pathUnderLogo + darkPath}-mobile.png`).then((image) => {
      setImageUnderLogoMobile(image.default);
    });
  });

  return (
    <div className="mb-10 mt-20 md:mt-0">
      <Link to={Routes.HomePage}>
        <img
          className="text-center m-auto"
          style={{ minWidth: '180px' }}
          src={imageUnderLogo}
          srcSet={`${imageUnderLogoMobile} 640w, ${imageUnderLogo} `}
          alt="Logo MortuaryInc"
        />
      </Link>
      <div className={(darkMode ? 'text-third' : 'text-primary') + ' font-sansLight text-sm mt-3 text-center'}>CURATING DEATH SINCE 2021</div>
    </div>
  );
};

export default Logo;
