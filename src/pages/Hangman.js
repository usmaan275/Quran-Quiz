// Hangman.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Hangman() {
  const surahNames = [
    "فاتحة", "بقرة", "نساء", "مائدة", "أنعام", "أعراف", "أنفال", "توبة", "يونس",
    "هود", "يوسف", "رعد", "إبراهيم", "حجر", "نحل", "إسراء", "كهف", "مريم", "طه",
    "أنبياء", "حج", "مؤمنون", "نور", "فرقان", "شعراء", "نمل", "قصص", "عنكبوت", "روم",
    "لقمان", "سجدة", "أحزاب", "سبإ", "فاطر", "يس", "صافات", "ص", "زمر", "غافر",
    "فصلت", "شورى", "زخرف", "دخان", "جاثية", "أحقاف", "محمد", "فتح", "حجرات", "ق",
    "ذاريات", "طور", "نجم", "قمر", "رحمن", "واقعة", "حديد", "مجادلة", "حشر", "ممتحنة",
    "صف", "جمعة", "منافقون", "تغابن", "طلاق", "تحريم", "ملك", "قلم", "حاقة", "معارج",
    "نوح", "جن", "مزمل", "مدثر", "قيامة", "إنسان", "مرسلات", "نبأ", "نازعات", "عبس",
    "تكوير", "انفطار", "مطففين", "انشقاق", "بروج", "طارق", "أعلى", "غاشية", "فجر", "بلد",
    "شمس", "ليل", "ضحى", "شرح", "تين", "علق", "قدر", "بينة", "زلزال", "عاديات",
    "قارعة", "تكاثر", "عصر", "همزة", "فيل", "قريش", "ماعون", "كوثر", "كافرون", "نصر",
    "لهب", "إخلاص", "فلق", "ناس"
  ];

  const [selectedSurah, setSelectedSurah] = useState("");
  const [blankedSurah, setBlankedSurah] = useState("");
  const [letterMap, setLetterMap] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const maxAttempts = 10;
  const [showNotification, setShowNotification] = useState(false); // Display messages
  const [notification, setNotification] = useState(''); // Display messages  
  const [showName, setShowName] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const timeoutRef = useRef(null);

  const closeNotification = () => {
    setShowNotification(false);
  };

  const getRandomSurah = () => {
    const randomIndex = Math.floor(Math.random() * surahNames.length);
    return surahNames[22];
  };

  const blankSurah = (surah) => {
    const chars = surah.split("");
    const map = [];
    const blanked = chars.map((char, index) => {
      if (char === " ") return " "; // Preserve spaces
      map.push({ letter: char, index });
      return "_";
    });
  
    setBlankedSurah(blanked.join(" "));
    setLetterMap(map);
  };

  const handleGuess = (guessedLetter) => {
    console.log(guessedLetter);
    // Avoid duplicate guess
    if (guessedLetters.includes(guessedLetter)) return;
  
    // Add to guessed letters
    setGuessedLetters(prev => [...prev, guessedLetter]);
  
    let correct = false;
    const updatedBlanked = blankedSurah.split(" ");
  
    letterMap.forEach(({ letter, index }) => {
      if (letter === guessedLetter) {
        updatedBlanked[index] = guessedLetter;
        correct = true;
        setNotification(`Good guess!`);
        setShowNotification(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowNotification(false), 5000);
      }
    });
  
    if (correct) {
      setBlankedSurah(updatedBlanked.join(" "));
    } else {
      if (!wrongGuesses.includes(guessedLetter)) {
        const updatedWrong = [...wrongGuesses, guessedLetter];
        setWrongGuesses(updatedWrong);
  
        if (updatedWrong.length >= maxAttempts) {
          setGameOver(true);
          setNotification(`Game over! The Surah was: ${selectedSurah}`);
          setShowNotification(true);
  
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setShowNotification(false), 50000);
        } else {
          if (maxAttempts - updatedWrong.length == 1){
            setNotification(`Na bruv, try again. (${maxAttempts - updatedWrong.length} attempt remaining)`);
            setShowNotification(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShowNotification(false), 5000);
          } else {
            setNotification(`Na bruv, try again. (${maxAttempts - updatedWrong.length} attempts remaining)`);
            setShowNotification(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setShowNotification(false), 5000);
          }
        }
      }
    }
  
    // Optional: check for win
    if (updatedBlanked.join("") === selectedSurah) {
      setGameOver(true);
      setNotification(`Well done dude!`);
      setShowName(true);
        setShowNotification(true);

        // Clear any existing timeout if it exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout to hide the notification after 5 seconds
        timeoutRef.current = setTimeout(() => {
          setShowNotification(false);
        }, 50000); // 5000 ms = 5 seconds
    }
  };  

  const getStyledSurah = () => {
    if (!gameOver) return blankedSurah;
  
    if (showName) {
      // Show full, connected Arabic with lightgreen
      return `<span style="color: lightgreen">${selectedSurah}</span>`;
    } else {
      // User lost — break into individual styled characters
      return selectedSurah
        .split("")
        .map((char) => {
          const color = guessedLetters.includes(char) ? "#fff" : "lightcoral";
          return `<span style="color: ${color}">${char}</span>`;
        })
        .join(""); // broken shaping is intentional
    }
  };  

  useEffect(() => {
    document.title = "Quranic Hangman"; // Set dynamic title
    const surah = getRandomSurah();
    setSelectedSurah(surah);
    blankSurah(surah);
  }, []);

  return (
    <div>
      <header className="App-header">
        <Link to="/home" className="Back-button">
          Back
        </Link>

        {/* Notification Area */}
        {showNotification && (
          <div className="notification-container">
            <span className="notification-text">{notification}</span>
            {/* Close Button */}
            <button onClick={closeNotification} className="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95 1.414-1.414 4.95 4.95z"/>
            </svg>
            </button>
          </div>
        )}

        <div>
        {/* Floating Instructions Button */}
          <button className="instructions-button" onClick={() => setIsOpen(true)}>
            ℹ️Instructions
          </button>

          {/* Overlay + Modal */}
          {isOpen && (
            <div className="overlay">
              <div className="popup">
                <h2>Game Instructions</h2>
                <p style={{ textAlign: "left" }}>
                  - Look at the amount of letters carefully. <br /><br />
                  - Guess letters to try and fill in the blanks. <br /><br />
                  - All words are Surah names. <br /><br />
                  - You have 10 chances in total. <br /><br />
                  - Don't let your fellow Muslim brother get hung!
                </p>

                {/* Close Button */}
                <button className="popup-close-button" onClick={() => setIsOpen(false)}>
                  ✖
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className='hangman-passage-container'>
        {/* Stand */}
        {wrongGuesses.length > 0 && <div className="base hangman-part" />}
        {wrongGuesses.length > 1 && <div className="pole hangman-part" />}
        {wrongGuesses.length > 2 && <div className="beam hangman-part" />}
        {wrongGuesses.length > 3 && <div className="rope hangman-part" />}

        {/* Body Parts */}
        {wrongGuesses.length > 4 && <div className="head hangman-part" />}
        {wrongGuesses.length > 5 && <div className="body hangman-part" />}
        {wrongGuesses.length > 6 && (
          <div className="left-arm hangman-part">
            <div className="left-arm-upper" />
            <div className="left-arm-lower" />
            <div className="left-arm-hand" />
          </div>
        )}
        {wrongGuesses.length > 7 && (
          <div className="right-arm hangman-part">
            <div className="right-arm-upper" />
            <div className="right-arm-lower" />
            <div className="right-arm-hand" />
          </div>
        )}
        {wrongGuesses.length > 8 && (
          <div className="left-leg hangman-part">
            <div className="left-shin" />
            <div className="left-shoe" />
          </div>
        )}
        {wrongGuesses.length > 9 && (
          <div className="right-leg hangman-part">
            <div className="right-shin" />
            <div className="right-shoe" />
          </div>
        )}
      </div>

      <div className="type-container">
        <div className='blanked'
          style={{
            position: "absolute",
            left: "50%",
            direction: "rtl",
            transform: "translateX(-50%)",
            fontSize: showName ? "3.5vmax" : "2.7vmax",
            fontFamily: "Scheherazade New",
            letterSpacing: showName ? "0" : "0.7vmax" ,
            fontWeight: "bold",
            color: !gameOver 
              ? "#fff" 
              : wrongGuesses.length >= maxAttempts 
                ? "lightcoral" 
                : "lightgreen",
            zIndex: 10,
            whiteSpace: "nowrap",
            transition: "2s"
          }}
          dangerouslySetInnerHTML={{
            __html: gameOver ? getStyledSurah() : blankedSurah,
          }}
        ></div>

        <div className="keyboard-container">
        {/* Keyboard */}
        <div className="keyboard-row">
          {/* Row 1 */}
          {["ج","ح","خ","ه","ع","غ","ف","ق","ث","ص","ض"].map((letter) => (
            <button
              key={letter}
              className="key h"
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || gameOver}
              style={{ opacity: guessedLetters.includes(letter) ? 0.4 : 1 }}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="keyboard-row">
          {/* Row 2 */}
          {["ة","ك","م","ن","ت","ا","ل","ب","ي","س","ش"].map((letter) => (
            <button
              key={letter}
              className="key h"
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || gameOver}
              style={{ opacity: guessedLetters.includes(letter) ? 0.4 : 1 }}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="keyboard-row">
          {/* Row 3 */}
          {["ى","و","ر","ز","د","ذ","ط","ظ","ء"].map((letter) => (
            <button
              key={letter}
              className="key h"
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || gameOver}
              style={{ opacity: guessedLetters.includes(letter) ? 0.4 : 1 }}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="keyboard-row">
          {/* Row 4 */}
          {["أ","إ","آ","ؤ","ئ"].map((letter) => (
            <button
              key={letter}
              className="key h"
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || gameOver}
              style={{ opacity: guessedLetters.includes(letter) ? 0.4 : 1 }}
            >
              {letter}
            </button>
          ))}
        </div>
        </div>
      </div>
      {gameOver && (
          <Link to="/home">
            <button className="Start-button">Back to Home</button>
          </Link>
        )}
    </div>
  );
}

export default Hangman;