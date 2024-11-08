// src/App.js
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
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`max-w-6xl mx-auto p-5 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-4xl font-bold text-center mb-4">HLS Player</h1>
      <button
        onClick={toggleDarkMode}
        className="mb-4 flex items-center px-4 py-2 rounded-md bg-white text-white hover:bg-blue-600 transition"
      >
        <img
          src={isDarkMode ? sunIcon : moonIcon}
          alt="Toggle Dark Mode"
          className="w-6 h-6"
        />
      </button>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={videoUrl}
          onChange={handleUrlChange}
          placeholder="Paste your HLS stream URL here"
          className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Load Stream
        </button>
      </form>
    </div>
  );
};

export default App;
