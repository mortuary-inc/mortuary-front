import { Mode, MortuaryContext } from 'context/MortuaryContext';
import Necrology from 'features/Necrology/Necrology2';

const AllNecrology = () => {
  return (
    <MortuaryContext.Provider
      value={{
        mode: Mode.Parlor,
        viewWallet: '',
        voxelSelected: null,
        voxels: [],
        boosters: [],
      }}
    >
      <div className="mt-10">
        <Necrology withStats={true} />
      </div>
    </MortuaryContext.Provider>
  );
};

export default AllNecrology;
