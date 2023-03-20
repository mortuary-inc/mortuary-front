import React from 'react';
import ReactPlayer from 'react-player/lazy';
import './VideoBG.css';
// Lazy load the YouTube player

const VideoBG = () => {
  return (
    <div className="player-wrapper">
      <ReactPlayer url="https://www.youtube.com/watch?v=Xln4GazPWAo" className="react-player" width="100%" height="100%" playing={true} />
    </div>
  );
};

export default VideoBG;
