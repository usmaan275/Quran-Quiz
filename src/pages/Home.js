// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import '../App.css'; // Import the same CSS file to maintain styling
import qubaImage from '../quba.webp'; // Import the local image file
import { Link } from 'react-router-dom';

function Home() {
  const [isImageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    document.title = "Quran Quiz | Home"; // Set dynamic title
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img 
          className={`quba ${isImageLoaded ? 'loaded' : ''}`}
          src={qubaImage} // Use the imported local image file
          alt="Arabic Calligraphy with Text"
          onLoad={() => setImageLoaded(true)} // Fade-in effect when the image loads
        />

        
        <div className="card-container">
          <Link className="card" to="/arabic-setup">Arabic Hifdh Test</Link>
          <Link className="card" to="/english-setup">English Hifdh Test</Link>
          <Link className="card" to="/mcq">Multiple Choice Questions</Link>
          <Link className="card" to="/hangman">Quranic Hangman</Link>
        </div>
      </header>
    </div>
  );
}

export default Home;
