// src/HLSPlayer.js
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);


  return (
    <video ref={videoRef} controls className="w-full h-auto rounded-md mt-4">
      Your browser does not support the video tag.
    </video>
  );
};

export default HLSPlayer;
