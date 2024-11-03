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

  return <div></div>;
};

export default App;
