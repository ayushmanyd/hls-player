import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import PlayIcon from "./assets/icons/play.svg";
import PauseIcon from "./assets/icons/pause.svg";
import BackwardIcon from "./assets/icons/backward.svg";
import ForwardIcon from "./assets/icons/forward.svg";
import VolumeMuteIcon from "./assets/icons/volume-mute.svg";
import FullscreenExpandIcon from "./assets/icons/fullscreen-expand.svg";
import FullscreenCompressIcon from "./assets/icons/fullscreen-compress.svg";

const HLSPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isDragging, setIsDragging] = useState(false); // Flag to track if the user is dragging the seekbar

  useEffect(() => {
    const video = videoRef.current;
    let hls = null;

    if (Hls.isSupported() && video) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      return () => {
        if (hls) hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setVolume(video.muted ? 0 : 1);
  };

  const handleVolumeChange = (event) => {
    const video = videoRef.current;
    const newVolume = event.target.value;
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const seekBackward = () => {
    const video = videoRef.current;
    video.currentTime -= 10;
  };

  const seekForward = () => {
    const video = videoRef.current;
    video.currentTime += 10;
  };

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full" />
      <div
        className={`absolute bottom-2 left-0 right-0 flex items-center justify-between p-4 ${
          isFullscreen ? "fullscreen-controls" : ""
        }`}
      >
      </div>
    </div>
  );
};

export default HLSPlayer;
