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

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePlaybackRateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setPlaybackRate(newRate);
    const video = videoRef.current;
    video.playbackRate = newRate;
  };

  const handleSeekbarChange = (event) => {
    const video = videoRef.current;
    const newTime = event.target.value;
    video.currentTime = newTime;
  };

  useEffect(() => {
    const video = videoRef.current;
    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(video.currentTime);
      }
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", updateTime);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
    };
  }, [isDragging]);

  const handleSeekbarMouseDown = () => {
    setIsDragging(true);
  };

  const handleSeekbarMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <video ref={videoRef} className="w-full" />
      <div
        className={`absolute bottom-2 left-0 right-0 flex items-center justify-between p-4 ${
          isFullscreen ? "fullscreen-controls" : ""
        }`}
      >
        {/* Left Controls */}
        <div className="flex space-x-2">
          <button onClick={seekBackward} className="p-2">
            <img
              src={BackwardIcon}
              alt="Backward"
              className="w-6 h-6 filter brightness-0 invert"
            />
          </button>
          <button onClick={togglePlay} className="p-2">
            {isPlaying ? (
              <img
                src={PauseIcon}
                alt="Pause"
                className="w-6 h-6 filter brightness-0 invert"
              />
            ) : (
              <img
                src={PlayIcon}
                alt="Play"
                className="w-6 h-6 filter brightness-0 invert"
              />
            )}
          </button>
          <button onClick={seekForward} className="p-2">
            <img
              src={ForwardIcon}
              alt="Forward"
              className="w-6 h-6 filter brightness-0 invert"
            />
          </button>
        </div>

        {/* Playback Speed Control */}
        <div className="flex items-center space-x-2">
          <label htmlFor="playback-speed" className="text-white">
            Speed:
          </label>
          <select
            id="playback-speed"
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            className="bg-transparent text-white"
          >
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default HLSPlayer;
