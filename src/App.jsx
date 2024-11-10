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
          
        </div>
      </div>
    </div>
  );
};

export default App;
