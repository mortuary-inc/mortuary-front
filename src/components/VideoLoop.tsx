import { useEffect, useRef, useState } from 'react';
import ImgixClient from 'api/ImgixClient';
import LazyLoad from 'react-lazyload';

export const playVideo = (video: React.RefObject<HTMLVideoElement>) => {
  if (!video || !video.current || !video.current.videoWidth) return;

  try {
    video.current.play();
  } catch (error) {}
};

export const pauseVideo = (video: React.RefObject<HTMLVideoElement>) => {
  if (!video || !video.current || !video.current.videoWidth) return;

  try {
    video.current.pause();
  } catch (error) {}
};
interface VideoLoopProps {
  src: string;
  poster?: string;
  name?: string;
  w: number;
  q?: number;
  classN?: string;
  setVideosRef?: React.Dispatch<
    React.SetStateAction<{
      [key: string]: React.RefObject<HTMLVideoElement>;
    }>
  >;
}

const VideoLoop = ({ src, poster, name, setVideosRef, classN, q, w }: VideoLoopProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const [image, setImage] = useState<string>();
  let [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    if (src === '') {
      return;
    }
    if (setVideosRef && name && video)
      setVideosRef((videosRef) => {
        videosRef[name] = video;
        return { ...videosRef };
      });
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '') {
      setIsLocal(true);
    } else {
      setIsLocal(false);
      const url = ImgixClient.buildURL(window.location.origin.toString() + src, { w: w, fm: 'mp4' });
      console.log(window.location.origin.toString() + src);
      setImage(url);
    }
  }, [video, name, setVideosRef, src, w]);

  const playVideo = () => {
    // You can use the play method as normal on your video ref
    //console.log('OVER');
    video.current && video.current.play();
  };

  const pauseVideo = () => {
    // Pause as well
    //console.log('OUT');
    video.current && video.current.pause();
  };

  return (
    <LazyLoad height={w}>
      <video
        id={name ? name : 'video'}
        poster={poster}
        loop
        ref={video}
        onMouseOver={() => playVideo()}
        onMouseOut={() => pauseVideo()}
        muted={true}
        src={isLocal ? src : image}
        className="rounded-xl "
      ></video>
    </LazyLoad>
  );
};

export default VideoLoop;
