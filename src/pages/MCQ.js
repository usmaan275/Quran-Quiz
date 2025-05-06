import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const questions = [
  {
    question: "What is the longest Surah in the Qur'an?",
    options: ["Surah Baqarah", "Surah Ali Imran", "Surah Kahf", "Surah Yasin"],
    answer: "Surah Baqarah"
  },
  {
    question: "How many Surahs are there in the Qur'an?",
    options: ["112", "113", "114", "115"],
    answer: "114"
  },
  {
    question: "What language is the Qur'an revealed in?",
    options: ["Hebrew", "Persian", "Arabic", "Urdu"],
    answer: "Arabic"
  },
  {
    question: "Who was the first prophet mentioned in the Qur'an?",
    options: ["Nuh", "Adam", "Musa", "Ibrahim"],
    answer: "Adam"
  },
  {
    question: "Which Surah has no Bismillah?",
    options: ["Surah Tawbah", "Surah Fatihah", "Surah Ikhlas", "Surah Qadr"],
    answer: "Surah Tawbah"
  },
];

function MCQ() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.title = "Multiple Choice Quiz";
  }, []);

  const handleSubmit = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');
    } else {
      setShowResults(true);
    }
  };

  return (
    <div>
      <header className="App-header">
        <Link to="/home" className="Back-button">
          Back
        </Link>

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
                  - Read the questions carefully. <br /><br />
                  - Answer all five questions. <br /><br />
                  - There is no timer, this is just for fun. <br /><br />
                  - Click "Next" to proceed. <br /><br />
                  - Let's see what you can do.
                </p>

                {/* Close Button */}
                <button className="popup-close-button" onClick={() => setIsOpen(false)}>
                  ✖
                </button>
              </div>
            </div>
          )}
        </div>

        {!showResults ? (
          <div>
            <h2>Question {currentQuestion + 1}</h2>
            <div className="selection-content">
              {questions[currentQuestion].question}
            </div>

            {questions[currentQuestion].options.map((option, index) => (
              <div>
                <label key={index} className="juzz-label">
                {option}
                  <input
                    type="radio"
                    name="option"
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                  />
                </label>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="Start-button"
            >
              {currentQuestion + 1 === questions.length ? 'Submit Quiz' : 'Next Question'}
            </button>
          </div>
        ) : (
          <div>
            <h2>Quiz Complete!</h2>
            <p>Your score: {score} / {questions.length}</p>
            <Link to="/home">
              <button className="Start-button">Back to Home</button>
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}

export default MCQ;
