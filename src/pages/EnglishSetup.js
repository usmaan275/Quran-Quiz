// EnglishSearch.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EnglishSetup() {
  useEffect(() => {
    document.title = "English Hifdh Test"; // Set dynamic title
  }, []);

  // State for toggle selection: "Juzz," "Surah," or "Custom"
  const [selectedJuzz, setSelectedJuzz] = useState([]); // Track selected Juzz
  const [isStartEnabled, setIsStartEnabled] = useState(false); // Track if Start button is enabled
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Minimum requirements
  const MIN_JUZZ = 1;

  // Check if Start button should be enabled based on selected Juzz
  useEffect(() => {
    setIsStartEnabled(selectedJuzz.length >= MIN_JUZZ);
  }, [selectedJuzz]);


  // Handle Juzz selection toggle
  const handleJuzzChange = (juzz) => {
    setSelectedJuzz((prev) =>
      prev.includes(juzz) ? prev.filter(item => item !== juzz) : [...prev, juzz]
    );
  };

  // Handle "Select All" button click
  const handleSelectAll = () => {
    setSelectedJuzz(Array.from({ length: 30 }, (_, i) => i + 1)); // Select all Juzz (1 to 30)
  };

  // Handle "Deselect All" button click
  const handleDeselectAll = () => {
    setSelectedJuzz([]); // Deselect all
  };

  // Navigate to the questions page, passing the selected Juzz data
  const handleStart = () => {
    if (isStartEnabled) {
      navigate("/english-questions", { state: { selectedJuzz } });
    }
  };

  return (
    <div>
      <header className="App-header">
        <Link to="/home" className="Back-button">Back</Link>

        <div>
        {/* Floating Instructions Button */}
          <button className="instructions-button" onClick={() => setIsOpen(true)}>
            ℹ️ Instructions
          </button>

          {/* Overlay + Modal */}
          {isOpen && (
            <div className="overlay">
              <div className="popup">
                <h2>Game Instructions</h2>
                <p style={{ textAlign: "left" }}>
                  - Read the passage carefully. <br /><br />
                  - Answer all three questions. <br /><br />
                  - Timer will keep running until completion. <br /><br />
                  - Click "Next" to proceed. <br /><br />
                  - Your score is based on time taken.
                </p>

                {/* Close Button */}
                <button className="popup-close-button" onClick={() => setIsOpen(false)}>
                  ✖
                </button>
              </div>
            </div>
          )}
        </div>

        <h2>Select the Juzz you would like to be tested on</h2>

        {/* Conditionally render content based on selected option */}
        <div className="selection-content">
            {/* Container for Select All / Deselect All Buttons */}
            <div className="toggle-buttons-container">
              <button 
                className="toggle-button" 
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button 
                className="toggle-button" 
                onClick={handleDeselectAll}
              >
                Deselect All
              </button>
            </div>
          <div className="juzz-options">
            {[...Array(30).keys()].map(i => (
              <label key={i} className="juzz-label">
                <span>{`Juzz ${i + 1}`}</span>
                <input 
                  type="checkbox"
                  checked={selectedJuzz.includes(i + 1)}
                  onChange={() => handleJuzzChange(i + 1)}
                />
              </label>
            ))}
          </div>
        </div>
      </header>
      
      {/* Start button */}
      <button className="Start-button" onClick={handleStart} disabled={!isStartEnabled}>
        Start
      </button>
    </div>
  );
}

export default EnglishSetup;
