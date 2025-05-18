import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const questions = [
  {
    question: "Who was the first prophet mentioned in the Quran?",
    options: ["Prophet Nuh", "Prophet Adam", "Prophet Musa", "Prophet Ibrahim"],
    answer: "Prophet Adam"
  },
  {
    question: "In which month was the Quran revealed?",
    options: ["Shaban", "Rajab", "Ramadan", "Muharram"],
    answer: "Ramadan"
  },
  {
    question: "Which of these is not a miracle of Prophet Isa (Jesus)?",
    options: ["Speaking in the cradle", "Healing the blind", "Parting the sea", "Raising the dead"],
    answer: "Parting the sea"
  },
  {
    question: "How much inheritance does a husband receive from his wife if she has no children?",
    options: ["One-fourth", "One-third", "One-half", "All of it"],
    answer: "One-half"
  },
  {
    question: "Which group is in the lowest depths of Hell?",
    options: ["Disbelievers", "Hypocrites", "Murderers", "Arrogant people"],
    answer: "Hypocrites"
  },
  {
    question: "Which of these is NOT a Fardh (obligatory) act of Wudu?",
    options: ["Washing the feet", "Wiping the head", "Washing the face", "Saying Bismillah"],
    answer: "Saying Bismillah"
  },
  {
    question: "Which heavenly body did Prophet Ibrahim NOT mention when rejecting false gods?",
    options: ["Stars", "Moon", "Sun", "Clouds"],
    answer: "Clouds"
  },
  {
    question: "Which prophet's people killed the she-camel sent as a sign?",
    options: ["Prophet Hud", "Prophet Salih", "Prophet Shu'ayb", "Prophet Nuh"],
    answer: "Prophet Salih"
  },
  {
    question: "What was the first major battle in Islam?",
    options: ["Battle of Uhud", "Battle of Badr", "Battle of Khandaq", "Battle of Hunayn"],
    answer: "Battle of Badr"
  },
  {
    question: "What is the other major battle mentioned by name in the Quran",
    options: ["Battle of Tabuk", "Battle of Hunayn", "Battle of Badr", "Battle of Uhud"],
    answer: "Battle of Hunayn"
  },
  {
    question: "Whose body has been preserved as a sign for later generations?",
    options: ["Pharaoh", "Qarun", "Haman", "Abu Lahab"],
    answer: "Pharaoh"
  },
  {
    question: "Which prophet has the best of stories narrated in the Quran?",
    options: ["Prophet Yusuf", "Prophet Musa", "Prophet Isa", "Prophet Dawud"],
    answer: "Prophet Yusuf"
  },
  {
    question: "What brings reassurance to the hearts?",
    options: ["Prayer", "Sadaqah", "Remembrance of Allah", "Reciting the Quran"],
    answer: "Remembrance of Allah"
  },
  {
    question: "How many gates does Jahannam (Hell) have?",
    options: ["5", "6", "7", "8"],
    answer: "7"
  },
  {
    question: "Where did the Prophet ﷺ go during the Isra' (Night Journey)?",
    options: ["Al-Masjid al-Haram", "Mount Hira", "Al-Masjid al-Aqsa", "Mount Sinai"],
    answer: "Al-Masjid al-Aqsa"
  },
  {
    question: "Which prophet spoke while still a baby?",
    options: ["Prophet Yahya", "Prophet Isa", "Prophet Musa", "Prophet Ibrahim"],
    answer: "Prophet Isa"
  },
  {
    question: "Who is known as Dhun-Noon in the Quran?",
    options: ["Prophet Yusuf", "Prophet Yunus", "Prophet Hud", "Prophet Idris"],
    answer: "Prophet Yunus"
  },
  {
    question: "What is the highest level of Paradise called?",
    options: ["Al-Firdaws", "Jannat al-Na'im", "Jannat al-Khuld", "Dar al-Salam"],
    answer: "Al-Firdaws"
  },
  {
    question: "Who is referred to as 'Ar-Ruh al-Amin' (The Trustworthy Spirit)?",
    options: ["Angel Jibreel", "Angel Mikaeel", "Angel Israfeel", "The Prophet ﷺ"],
    answer: "Angel Jibreel"
  },
  {
    question: "Which city did Prophet Musa escape to after killing a man?",
    options: ["Makkah", "Madyan", "Jerusalem", "Tih"],
    answer: "Madyan"
  },
  {
    question: "How did the Muslims defend themselves during the Battle of Ahzab?",
    options: ["By ambushing", "With a trench", "Using archers", "Mountain retreat"],
    answer: "With a trench"
  },
  {
    question: "Which Surah is known as the 'Heart of the Quran'?",
    options: ["Surah Al-Fatiha", "Surah Al-Kahf", "Surah Ar-Rahman", "Surah Yasin"],
    answer: "Surah Yasin"
  },
  {
    question: "Which prophet returned to his nation of 100,000 or more believers?",
    options: ["Prophet Nuh", "Prophet Yunus", "Prophet Musa", "Prophet Shu'ayb"],
    answer: "Prophet Yunus"
  },
  {
    question: "How many gates does Jannah (Paradise) have?",
    options: ["5", "6", "7", "8"],
    answer: "8"
  },
  {
    question: "On the Day of Judgement, every nation will be seen doing what?",
    options: ["Flying", "Running", "Kneeling", "Hiding"],
    answer: "Kneeling"
  },
  {
    question: "Which treaty was signed between the Muslims and the Makkans?",
    options: ["Treaty of Uhud", "Treaty of Khandaq", "Treaty of Hudaybiyyah", "Treaty of Hijrah"],
    answer: "Treaty of Hudaybiyyah"
  },
  {
    question: "How many times is the verse 'Which of your Lord's favours will you deny?' repeated in Surah Ar-Rahman?",
    options: ["31", "7", "26", "10"],
    answer: "31"
  },
  {
    question: "What is the most disliked permissible act in Islam?",
    options: ["Eating too much", "Excessive talking", "Divorce", "Debt"],
    answer: "Divorce"
  },
  {
    question: "In which hand will the righteous receive their book of deeds?",
    options: ["Right", "Left", "Both", "Behind their backs"],
    answer: "Right"
  },
  {
    question: "How many Surahs are there in the Quran?",
    options: ["112", "113", "114", "115"],
    answer: "114"
  }
];

function MCQ() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    document.title = "Multiple Choice Quiz";
  }, []);

  const handleSubmit = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
      setCorrectAnswers(prev => [...prev, currentQuestion]);
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
            {showResults ? '📈 Review' : 'ℹ️ Instructions'}
          </button>

          {/* Overlay + Modal */}
          {isOpen && (
            <div className="overlay">
              <div className="popup">
                {!showResults ? (
                  <>
                    <h2>Game Instructions</h2>
                    <p style={{ textAlign: "left" }}>
                      - Read the questions carefully. <br /><br />
                      - Answer all 30 questions. <br /><br />
                      - There is no timer, this is just for fun. <br /><br />
                      - Click "Next" to proceed. <br /><br />
                      - Let's see what you can do.
                    </p>
                  </>
                ) : (
                  <>
                    <h2>Questions</h2>
                    {questions.map((q, index) => {
                      const isCorrect = correctAnswers.includes(index);
                      return (
                        <p
                          key={index}
                          style={{
                            textAlign: "left",
                            color: isCorrect ? "lightgreen" : "lightcoral",
                            fontSize: "0.9em",
                          }}
                        >
                          Question {index + 1}: {q.question}
                        </p>
                      );
                    })}
                    <p>Can you do better next time?</p>
                  </>
                )}

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
            <h2 className='mcq-question'>Question {currentQuestion + 1}</h2>
            <div className="selection-content mcq">
              {questions[currentQuestion].question}
            </div>

            {questions[currentQuestion].options.map((option, index) => (
              <div>
                <label key={index} className="juzz-label mcq">
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
            <p style={{ fontWeight: 'bold' }}>Your score: {score} / {questions.length}</p>
            <p style={{ fontSize: '2vmin' }}>Check the top left!</p>
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
