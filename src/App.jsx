import React, { useState, useEffect } from "react";
import HLSPlayer from "./HLSPlayer";
import sunIcon from "./assets/sun.svg";
import moonIcon from "./assets/moon.svg";

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = videoUrl.endsWith(".m3u8");
    setIsValidUrl(isValid);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">HLS Player</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Toggle dark mode"
            >
              <img
                src={isDarkMode ? sunIcon : moonIcon}
                alt="Toggle Dark Mode"
                className="w-6 h-6"
              />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={videoUrl}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
