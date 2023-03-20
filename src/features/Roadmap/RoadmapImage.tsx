import RoadMapIMG from 'assets/roadmap-background.png';
import ImageLoader from 'components/ImageLoader';
export const roadmapID = 'roadmapID';

const RoadmapImage = () => {
  return (
    <div className="relative w-full aspect-w-6 aspect-h-5 bg-primary">
      <ImageLoader alt={'Roadmap illustration in voxel'} img={RoadMapIMG} w={1600} lazy={false} />
    </div>
  );
};

export default RoadmapImage;
