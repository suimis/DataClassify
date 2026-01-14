import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottieAnimation = ({
  animationPath = '/lotties/Loading animation blue.json',
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
  speed = 1,
  keepLastFrame = false,
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Player
        src={animationPath}
        style={{ width, height }}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        keepLastFrame={keepLastFrame}
      />
    </div>
  );
};

export default LottieAnimation;
