// ArabicResults.js
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function ArabicResults() {
    const navigate = useNavigate();
    const location = useLocation();
    // Destructure score from state
    const {
        back = "arabic",
        score = 0,
        stepForPtsDeducted = 0,
        stepForPtsAdded = 0,
        time = 0,
        pointsDeducted = 0,
        pointsAdded = 0,
        juzz = 0,
      } = location.state || {};

    // Determine score color class
    const getScoreClass = () => {
        if (score <= 333) return "low-score";
        if (score <= 666) return "medium-score";
        return "high-score";
    };

    useEffect(() => {
        document.title = "Results"; // Set dynamic title
    }, []);

    return (
        <div>
            <header className="App-header">                
                <div className="score-wrapper">
                    <h1 className={`score-display ${getScoreClass()}`}>
                    Your Score: {score}
                    </h1>
                    <div className="score-table-container">
                        <table className="score-table">
                            <tbody>
                            <tr>
                                <td className="label">Starting Score:</td>
                                <td className="value">1000</td>
                            </tr>
                            <tr>
                                <td className="label">Correct Guesses:</td>
                                <td className="value">{pointsAdded / stepForPtsAdded} (× {stepForPtsAdded}pts)</td>
                            </tr>
                            <tr>
                                <td className="label">Time Taken:</td>
                                <td className="value">{time}s</td>
                            </tr>
                            <tr>
                                <td className="label">Incorrect Guesses:</td>
                                <td className="value">{pointsDeducted / stepForPtsDeducted} (× -{stepForPtsDeducted}pts)</td>
                            </tr>
                            <tr>
                                <td className="label">Juzz Selected:</td>
                                <td className="value">{juzz} out of 30</td>
                            </tr>
                            <tr>
                                <td className="label">Final Score:</td>
                                <td className="value">(1000 + {pointsAdded} - {time} - {pointsDeducted}) × ({juzz}/30) = {score}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="toggle-buttons-container">
                        <button className="toggle-button" onClick={() => navigate(`/${back}-setup`)}>
                        Play Again
                        </button>
                        <button className="toggle-button" onClick={() => navigate('/home')}>
                        Back to Home
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default ArabicResults;