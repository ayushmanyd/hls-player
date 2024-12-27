import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import PlayIcon from "./assets/icons/play.svg";
import PauseIcon from "./assets/icons/pause.svg";
import BackwardIcon from "./assets/icons/backward.svg";
import ForwardIcon from "./assets/icons/forward.svg";
import VolumeMuteIcon from "./assets/icons/volume-mute.svg";
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
  // Refs and State
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

  // HLS Setup
  const setupHLS = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls = null;
    try {
      if (Hls.isSupported()) {
        hls = new Hls({
          // Additional HLS configuration options
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        });

        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          // Handle different types of errors
        });

        return hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        video.addEventListener("loadedmetadata", () => {
          if (autoPlay) video.play();
        });
      }
    } catch (error) {
      console.error("Video setup error:", error);
    }

    return hls;
  }, [videoUrl, autoPlay]);

  // Effect for HLS setup and cleanup
  useEffect(() => {
    const hls = setupHLS();

    return () => {
      if (hls) hls.destroy();
    };
  }, [setupHLS]);

  // Event Handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    } else {
      video.pause();
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    }
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

  const handleVolumeChange = (event) => {
    const video = videoRef.current;
    const newVolume = parseFloat(event.target.value);

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
      video.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Video Event Listeners
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

  // Render
  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className="w-full"
        onError={(e) => console.error("Video error:", e)}
      />

      {/* Player Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
        {/* Seekbar */}
        <input
          type="range"
          min="0"
          max={playerState.duration || 0}
          value={playerState.currentTime}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="w-full mb-2"
        />

        {/* Time Display */}
        <div className="text-white text-sm mb-2">
          {formatTime(playerState.currentTime)} /{" "}
          {formatTime(playerState.duration)}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-between items-center">
          {/* Playback Controls */}
          <div className="flex space-x-2">
            <button onClick={() => seekTo(playerState.currentTime - 10)}>
              <img
                src={BackwardIcon}
                alt="Backward"
                className="w-6 h-6 invert"
              />
            </button>
            <button onClick={togglePlay}>
              <img
                src={playerState.isPlaying ? PauseIcon : PlayIcon}
                alt={playerState.isPlaying ? "Pause" : "Play"}
                className="w-6 h-6 invert"
              />
            </button>
            <button onClick={() => seekTo(playerState.currentTime + 10)}>
              <img src={ForwardIcon} alt="Forward" className="w-6 h-6 invert" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleMute}>
              <img src={VolumeMuteIcon} alt="Mute" className="w-6 h-6 invert" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={playerState.volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>

          {/* Fullscreen Control */}
          <button onClick={toggleFullscreen}>
            <img
              src={
                playerState.isFullscreen
                  ? FullscreenCompressIcon
                  : FullscreenExpandIcon
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HLSPlayer;
