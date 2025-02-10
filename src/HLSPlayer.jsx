import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import PlayIcon from "./assets/icons/play.svg";
import PauseIcon from "./assets/icons/pause.svg";
import BackwardIcon from "./assets/icons/backward.svg";
import ForwardIcon from "./assets/icons/forward.svg";
import VolumeMuteIcon from "./assets/icons/volume-mute.svg";
import VolumeIcon from "./assets/icons/volume.svg";
import FullscreenExpandIcon from "./assets/icons/fullscreen-expand.svg";
import FullscreenCompressIcon from "./assets/icons/fullscreen-compress.svg";

// Utility function to format time
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return [hours, minutes, remainingSeconds]
    .map((v) => v.toString().padStart(2, "0"))
    .filter((v, i) => !(i === 0 && v === "00"))
    .join(":");
};

const HLSPlayer = ({ videoUrl, autoPlay = true }) => {
  const videoRef = useRef(null);
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isFullscreen: false,
    playbackRate: 1,
    isMuted: false,
  });

  const setupHLS = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls = null;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
      });

      return hls;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        if (autoPlay) video.play();
      });
    }
    return hls;
  }, [videoUrl, autoPlay]);

  useEffect(() => {
    const hls = setupHLS();
    return () => hls && hls.destroy();
  }, [setupHLS]);

  const togglePlay = () => {
    const video = videoRef.current;
    video.paused ? video.play() : video.pause();
    setPlayerState((prev) => ({ ...prev, isPlaying: !video.paused }));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setPlayerState((prev) => ({
      ...prev,
      isMuted: video.muted,
      volume: video.muted ? 0 : prev.volume,
    }));
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setPlayerState((prev) => ({
      ...prev,
      volume: newVolume,
      isMuted: newVolume === 0,
    }));
  };

  const seekTo = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(seconds, video.duration));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video
        .requestFullscreen()
        .catch((err) => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayerState = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: video.currentTime,
        duration: video.duration,
        isPlaying: !video.paused,
      }));
    };

    const handleFullscreenChange = () => {
      setPlayerState((prev) => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }));
    };

    video.addEventListener("timeupdate", updatePlayerState);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("timeupdate", updatePlayerState);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg">
  <video
    ref={videoRef}
    className="w-full h-auto"
    onError={(e) => console.error("Video error:", e)}
  />

  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent">
    {/* Progress bar */}
    <input
      type="range"
      min="0"
      max={playerState.duration || 0}
      value={playerState.currentTime}
      onChange={(e) => seekTo(parseFloat(e.target.value))}
      className="w-full h-1 bg-gray-500 accent-primaryColor rounded-full cursor-pointer mb-3 transition-all"
    />

    <div className="flex items-center justify-between text-white">
      {/* Left controls */}
      <div className="flex items-center space-x-6">
        <button
          onClick={() => seekTo(playerState.currentTime - 10)}
          aria-label="Rewind 10 seconds"
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
        >
          <img src={BackwardIcon} alt="Rewind" className="w-6 h-6" />
        </button>
        <button
          onClick={togglePlay}
          aria-label={playerState.isPlaying ? "Pause" : "Play"}
          className="p-2 rounded-full bg-primaryColor hover:bg-primaryColor/90 transition"
        >
          <img
            src={playerState.isPlaying ? PauseIcon : PlayIcon}
            alt="Play/Pause"
            className="w-6 h-6"
          />
        </button>
        <button
          onClick={() => seekTo(playerState.currentTime + 10)}
          aria-label="Forward 10 seconds"
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
        >
          <img src={ForwardIcon} alt="Forward" className="w-6 h-6" />
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-4">
        <button
        >
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default HLSPlayer;
