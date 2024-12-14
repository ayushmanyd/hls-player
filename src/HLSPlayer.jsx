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
    };

  // Render
  return (
    <div className="relative w-full">
      
    </div>
  );
};

export default HLSPlayer;
