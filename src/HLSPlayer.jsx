// src/HLSPlayer.js
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (Hls.isSupported() && video) {
      const hls = new Hls();

      hls.loadSource(videoUrl);
      hls.attachMedia(video);
  }, [videoUrl]);

  return (
    <video ref={videoRef} controls className="w-full h-auto rounded-md mt-4">
      Your browser does not support the video tag.
    </video>
  );
};

export default HLSPlayer;
