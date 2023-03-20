import { Mode, useMortuaryContext } from 'context/MortuaryContext';
import { useEffect, useState } from 'react';
import TitlePlaceHolder from 'features/Placeholders/TitlePlaceholder';

interface IMortuaryProps {
  isLoading: boolean;
}

const MortuaryStateText = ({ isLoading }: IMortuaryProps) => {
  const { viewWallet, voxels, mode } = useMortuaryContext();
  let [text, setText] = useState('Welcome to your Funerary Pyre.');
  let [title, setTitle] = useState('Good Mourning');

  const hasVoxel = voxels.length > 0;

  useEffect(() => {
    if (!viewWallet) {
      // No wallet connected
      setTitle('Good Mourning');
      setText('Apprentices & Gravediggers.');
    } else if (!hasVoxel) {
      // No voxel
      setTitle('Good Mourning');
      setText('Death is nowhere near here.');
    } else if (mode == Mode.Commons) {
      setTitle('You are visiting');
      setText('a public funerary plot.');
    } else if (mode == Mode.Parlor) {
      setTitle('You are visiting');
      setText('a private funerary plot.');
    } else if (mode == Mode.My) {
      setTitle('Welcome to your');
      setText('Private Funeral Plot');
    }
  }, [viewWallet, hasVoxel, mode]);

  if (isLoading) {
    return (
      <div className="w-10/12 md:w-4/12 mx-auto mt-14 mb-10">
        <TitlePlaceHolder backgroundColor="#e6e0ca" foregroundColor="#f4eed7" />
      </div>
    );
  }

  if (!isLoading) {
    return (
      <div className="text-center text-4xl font-serif font-extralight mt-14 mb-10">
        <div className="text-secondary">{title}</div>
        <div className="text-third">{text}</div>
      </div>
    );
  }

  return <></>;
};

export default MortuaryStateText;
