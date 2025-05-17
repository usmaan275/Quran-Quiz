// EnglishQuestions.js
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import quranData from '../quran.json';

// A utility function to remove tashkeel and special characters from the Ayah text
const cleanText = (text) => {
  const tashkeelRegex = /[ًٌٍَُِّْٰۡ]/g; // Tashkeel and diacritics
  const specialSymbolsRegex = /[ۖۗۘۙۚۛۜ۝۞]/g; // Remove any special symbols
  return text.replace(tashkeelRegex, '').replace(specialSymbolsRegex, '').replace('ٱ', 'ا').replace('  ',' ').trim();
};

function EnglishQuestions() {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  const navigate = useNavigate();

  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const [passage, setPassage] = useState('');
  const passageRef = useRef(passage);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [passageAyat, setPassageAyat] = useState([]);
  const passageAyatRef = useRef([]);

  const [indexToBeGuessed, setIndexToBeGuessed] = useState(1);
  const indexRef = useRef(indexToBeGuessed); // Reference to hold latest index

  const [attempts, setAttempts] = useState(3); // Track remaining attempts
  const attemptsRef = useRef(attempts);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const currentQuestionRef = useRef(currentQuestion);

  const [completedPassage, setCompletedPassage] = useState(false); // Check if the passage is complete

  const [showNotification, setShowNotification] = useState(false); // Display messages
  const [notification, setNotification] = useState(''); // Display messages  

  const timeoutRef = useRef(null);
  const language = useRef("en-GB");

  const location = useLocation(); // Get the current location
  const { selectedJuzz } = location.state || { selectedJuzz: [] }; // Destructure selectedJuzz from state
  // Track if `fetchPassage` has already been called
  const fetchCalledRef = useRef(false);

  let firstGuess = true;

  const pointsDeducted = useRef(0);
  const pointsAdded = useRef(0);

  const stepForPtsDeducted = 20;
  const stepForPtsAdded = 10;

  const MIN_VISIBLE_CHARACTERS = 100;

  // // Define a mapping of Juzz numbers to their corresponding ayat ranges
  // const juzzAyatRanges = {
  //   1: { start: 48, end: 53 },      // Juzz 01: Ayat 0001 to 0148 ~ 148 Total Ayat
  //   2: { start: 190, end: 195 },    // Juzz 02: Ayat 0149 to 0259 ~ 111 Total Ayat
  //   3: { start: 268, end: 273 },    // Juzz 03: Ayat 0260 to 0384 ~ 125 Total Ayat
  //   4: { start: 422, end: 429 },    // Juzz 04: Ayat 0385 to 0516 ~ 132 Total Ayat
  //   5: { start: 624, end: 629 },    // Juzz 05: Ayat 0517 to 0640 ~ 124 Total Ayat
  //   6: { start: 675, end: 680 },    // Juzz 06: Ayat 0641 to 0751 ~ 111 Total Ayat
  //   7: { start: 848, end: 856 },    // Juzz 07: Ayat 0752 to 0899 ~ 148 Total Ayat
  //   8: { start: 939, end: 944 },    // Juzz 08: Ayat 0900 to 1041 ~ 142 Total Ayat
  //   9: { start: 1152, end: 1160 },  // Juzz 09: Ayat 1042 to 1200 ~ 159 Total Ayat
  //   10: { start: 1291, end: 1297 }, // Juzz 10: Ayat 1201 to 1328 ~ 128 Total Ayat
  //   11: { start: 1365, end: 1370 }, // Juzz 11: Ayat 1329 to 1478 ~ 150 Total Ayat
  //   12: { start: 1597, end: 1603 }, // Juzz 12: Ayat 1479 to 1648 ~ 170 Total Ayat
  //   13: { start: 1781, end: 1786 }, // Juzz 13: Ayat 1649 to 1802 ~ 154 Total Ayat
  //   14: { start: 1821, end: 1827 }, // Juzz 14: Ayat 1803 to 2029 ~ 227 Total Ayat
  //   15: { start: 2052, end: 2067 }, // Juzz 15: Ayat 2030 to 2214 ~ 185 Total Ayat
  //   16: { start: 2342, end: 2347 }, // Juzz 16: Ayat 2215 to 2483 ~ 269 Total Ayat
  //   17: { start: 2513, end: 2516 }, // Juzz 17: Ayat 2484 to 2673 ~ 190 Total Ayat
  //   18: { start: 2681, end: 2689 }, // Juzz 18: Ayat 2674 to 2875 ~ 202 Total Ayat
  //   19: { start: 2925, end: 2931 }, // Juzz 19: Ayat 2876 to 3218 ~ 343 Total Ayat
  //   20: { start: 3300, end: 3308 }, // Juzz 20: Ayat 3219 to 3384 ~ 166 Total Ayat
  //   21: { start: 3477, end: 3483 }, // Juzz 21: Ayat 3385 to 3563 ~ 179 Total Ayat
  //   22: { start: 3669, end: 3677 }, // Juzz 22: Ayat 3564 to 3726 ~ 163 Total Ayat
  //   23: { start: 3738, end: 3744 }, // Juzz 23: Ayat 3727 to 4089 ~ 363 Total Ayat
  //   24: { start: 4248, end: 4254 }, // Juzz 24: Ayat 4090 to 4264 ~ 175 Total Ayat
  //   25: { start: 4309, end: 4315 }, // Juzz 25: Ayat 4265 to 4510 ~ 246 Total Ayat
  //   26: { start: 4622, end: 4625 }, // Juzz 26: Ayat 4511 to 4705 ~ 195 Total Ayat
  //   27: { start: 5076, end: 5084 }, // Juzz 27: Ayat 4706 to 5104 ~ 399 Total Ayat
  //   28: { start: 5144, end: 5150 }, // Juzz 28: Ayat 5105 to 5241 ~ 137 Total Ayat
  //   29: { start: 5596, end: 5607 }, // Juzz 29: Ayat 5242 to 5672 ~ 431 Total Ayat
  //   30: { start: 6222, end: 6225 }, // Juzz 30: Ayat 5673 to 6236 ~ 564 Total Ayat
  // };

  const juzzAyatRanges = {
    1: { start: 1, end: 148 },      // Juzz 01: Ayat 0001 to 0148 ~ 148 Total Ayat
    2: { start: 149, end: 259 },    // Juzz 02: Ayat 0149 to 0259 ~ 111 Total Ayat
    3: { start: 260, end: 384 },    // Juzz 03: Ayat 0260 to 0384 ~ 125 Total Ayat
    4: { start: 385, end: 516 },    // Juzz 04: Ayat 0385 to 0516 ~ 132 Total Ayat
    5: { start: 517, end: 640 },    // Juzz 05: Ayat 0517 to 0640 ~ 124 Total Ayat
    6: { start: 641, end: 751 },    // Juzz 06: Ayat 0641 to 0751 ~ 111 Total Ayat
    7: { start: 752, end: 899 },    // Juzz 07: Ayat 0752 to 0899 ~ 148 Total Ayat
    8: { start: 900, end: 1041 },   // Juzz 08: Ayat 0900 to 1041 ~ 142 Total Ayat
    9: { start: 1042, end: 1200 },  // Juzz 09: Ayat 1042 to 1200 ~ 159 Total Ayat
    10: { start: 1201, end: 1328 }, // Juzz 10: Ayat 1201 to 1328 ~ 128 Total Ayat
    11: { start: 1329, end: 1478 }, // Juzz 11: Ayat 1329 to 1478 ~ 150 Total Ayat
    12: { start: 1479, end: 1648 }, // Juzz 12: Ayat 1479 to 1648 ~ 170 Total Ayat
    13: { start: 1649, end: 1802 }, // Juzz 13: Ayat 1649 to 1802 ~ 154 Total Ayat
    14: { start: 1803, end: 2029 }, // Juzz 14: Ayat 1803 to 2029 ~ 227 Total Ayat
    15: { start: 2030, end: 2214 }, // Juzz 15: Ayat 2030 to 2214 ~ 185 Total Ayat
    16: { start: 2215, end: 2483 }, // Juzz 16: Ayat 2215 to 2483 ~ 269 Total Ayat
    17: { start: 2484, end: 2673 }, // Juzz 17: Ayat 2484 to 2673 ~ 190 Total Ayat
    18: { start: 2674, end: 2875 }, // Juzz 18: Ayat 2674 to 2875 ~ 202 Total Ayat
    19: { start: 2876, end: 3218 }, // Juzz 19: Ayat 2876 to 3218 ~ 343 Total Ayat
    20: { start: 3219, end: 3384 }, // Juzz 20: Ayat 3219 to 3384 ~ 166 Total Ayat
    21: { start: 3385, end: 3563 }, // Juzz 21: Ayat 3385 to 3563 ~ 179 Total Ayat
    22: { start: 3564, end: 3726 }, // Juzz 22: Ayat 3564 to 3726 ~ 163 Total Ayat
    23: { start: 3727, end: 4089 }, // Juzz 23: Ayat 3727 to 4089 ~ 363 Total Ayat
    24: { start: 4090, end: 4264 }, // Juzz 24: Ayat 4090 to 4264 ~ 175 Total Ayat
    25: { start: 4265, end: 4510 }, // Juzz 25: Ayat 4265 to 4510 ~ 246 Total Ayat
    26: { start: 4511, end: 4705 }, // Juzz 26: Ayat 4511 to 4705 ~ 195 Total Ayat
    27: { start: 4706, end: 5104 }, // Juzz 27: Ayat 4706 to 5104 ~ 399 Total Ayat
    28: { start: 5105, end: 5241 }, // Juzz 28: Ayat 5105 to 5241 ~ 137 Total Ayat
    29: { start: 5242, end: 5672 }, // Juzz 29: Ayat 5242 to 5672 ~ 431 Total Ayat
    30: { start: 5673, end: 6236 }, // Juzz 30: Ayat 5673 to 6236 ~ 564 Total Ayat
  };

  const mutashabihatGroups = [
    [ // Surah al-Shuara ~ إِنَّ فِي ذَٰلِكَ لَآيَةً ۖ وَمَا كَانَ أَكْثَرُهُمْ مُؤْمِنِينَ
      2940, 2999, 3035, 3053, 3106, 3122
    ],

    [ // Surah al-Shuara ~ وَإِنَّ رَبَّكَ لَهُوَ الْعَزِيزُ الرَّحِيمُ
      2941, 3000, 3036, 3054, 3072, 3091, 3107, 3123
    ],

    [ // Surah al-Shuara ~ إِنِّي لَكُمْ رَسُولٌ أَمِينٌ
      3039, 3057, 3075, 3094, 3110, 
    ],

    [ // Surah al-Shuara ~ فَاتَّقُوا اللَّهَ وَأَطِيعُونِ
      3040, 3042, 3058, 3063, 3076, 3082, 3095, 3111
    ],

    [ // Surah al-Shuara ~ وَمَا أَسْأَلُكُمْ عَلَيْهِ مِنْ أَجْرٍ ۖ إِنْ أَجْرِيَ إِلَّا عَلَىٰ رَبِّ الْعَالَمِينَ
      3041, 3059, 3077, 3096, 3112
    ],

    [ // Surah al-Rahman ~ فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
      4914, 4917, 4919, 4922, 4924, 4926, 4929, 4931, 4933, 4935, 
      4937, 4939, 4941, 4943, 4946, 4948, 4950, 4952, 4954, 4956,
      4958, 4960, 4962, 4964, 4966, 4968, 4970, 4972, 4974, 4976,
      4978
    ],

    [ // Surah al-Mursalat ~ وَيْلٌ يَوْمَئِذٍ لِلْمُكَذِّبِينَ
      5637, 5641, 5646, 5650, 5656, 5659, 5662, 5667, 5669, 5671
    ]
  ];

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // const fetchPassage = async () => {
  //   if (loading) return; // Prevent multiple simultaneous fetches
  //   setLoading(true);
  //   setPassage('');
  //   setPassageAyat([]);
  //   passageAyatRef.current = [];
  //   setError(null);

  //   console.log("Starting fetch process..."); // Debugging log

  //   try {
  //     let isPassageFound = false;
  //     let passageText = '';
  //     while (!isPassageFound) {
  //       setPassageAyat([]);
  //       passageAyatRef.current = [];
  //       // Select a random Juzz
  //       const randomJuzzIndex = Math.floor(Math.random() * selectedJuzz.length);
  //       const selectedJuzzNumber = selectedJuzz[randomJuzzIndex];
  //       const { start, end } = juzzAyatRanges[selectedJuzzNumber];

  //       // Start with a random ayah in the Juzz range
  //       let currentAyah = Math.floor(Math.random() * (end - start + 1)) + start;
  //       console.log(currentAyah);

  //       // Loop to build the passage
  //       while (passageAyatRef.current.length < 4) {
  //         const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${currentAyah}/en.sahih`);
  //         const ayahText = response.data.data.text;

  //         let newAyah = {text: ayahText, ayahNumber: currentAyah, colour: "white"};
  //         // Update the ref to reflect the change immediately
  //         passageAyatRef.current = [...passageAyatRef.current, newAyah];
  //         // Optional: Update state to trigger a re-render if needed
  //         setPassageAyat([...passageAyatRef.current]);

  //         // Add ayah to passage with separator
  //         passageText += ayahText + '۞ ';
  //         currentAyah++; // Move to next ayah
        
  //         // Stop if end of Juzz is reached
  //         if (currentAyah > end) break;
  //       }

  //       if (passageAyatRef.current.length == 4) {
  //         isPassageFound = true;
  //       }

  //       // Set passage if found
  //       if (isPassageFound) {
  //       // passageText = passageText.replace(/[^\x20-\x7E\u0600-\u06FF]/g, '');  // Allow printable ASCII and Arabic characters
  //       console.log(cleanText(passageText));
  //       setPassage(generatePassageJSX(passageAyatRef.current, indexRef.current));
  //       }
  //     }
  //   } catch (err) {
  //     setError('Failed to fetch passage.');
  //     setPassage('');
  //     setPassageAyat([]);
  //     passageAyatRef.current = [];
  //   } finally {
  //     console.log("Fetch complete. Setting loading to false.");
  //     setLoading(false);
  //   }
  // };

  const fetchPassage = async () => {
    if (loading) return; // Prevent multiple simultaneous fetches
    setLoading(true);
    setPassage('');
    setPassageAyat([]);
    passageAyatRef.current = [];
    setError(null);

    await wait(500);
    console.log("Starting fetch process..."); // Debugging log

    let isPassageFound = false;
    let passageText = '';
    while (!isPassageFound) {
      setPassageAyat([]);
      passageAyatRef.current = [];
      indexRef.current = 0;
      passageText = '';
      // Select a random Juzz
      const randomJuzzIndex = Math.floor(Math.random() * selectedJuzz.length);
      const selectedJuzzNumber = selectedJuzz[randomJuzzIndex];
      const { start, end } = juzzAyatRanges[selectedJuzzNumber];

      // Start with a random ayah in the Juzz range
      let currentAyah = Math.floor(Math.random() * (end - start + 1)) + start;
      console.log(currentAyah);

      // Loop to build the passage
      while (passageText.length < MIN_VISIBLE_CHARACTERS) {
        const ayahObject = quranData.find(item => item.number === currentAyah);
        const ayahText = ayahObject.translation;

        let newAyah = {text: ayahText, ayahNumber: currentAyah, colour: "white"};
        // Update the ref to reflect the change immediately
        passageAyatRef.current = [...passageAyatRef.current, newAyah];
        // Optional: Update state to trigger a re-render if needed
        setPassageAyat([...passageAyatRef.current]);

        // Add ayah to passage with separator
        passageText += ayahText + '۞ ';
        currentAyah++; // Move to next ayah
        indexRef.current++;
      
        // Stop if end of Juzz is reached
        if (currentAyah > end) break;
      }

      let stop = indexRef.current + 3;

      if (!(currentAyah > end)) {
        while (passageAyatRef.current.length < stop) {
          const ayahObject = quranData.find(item => item.number === currentAyah);
          const ayahText = ayahObject.translation;

          let newAyah = {text: ayahText, ayahNumber: currentAyah, colour: "white"};

          // Update the ref to reflect the change immediately
          passageAyatRef.current = [...passageAyatRef.current, newAyah];
          // Optional: Update state to trigger a re-render if needed
          setPassageAyat([...passageAyatRef.current]);

          currentAyah++; // Move to next ayah
        
          // Stop if end of Juzz is reached
          if (currentAyah > end) break;
        }

        if (passageAyatRef.current.length == stop) {
          isPassageFound = true;
        }
      }

      // Set passage if found
      if (isPassageFound) {
        // passageText = passageText.replace(/[^\x20-\x7E\u0600-\u06FF]/g, '');  // Allow printable ASCII and Arabic characters
        console.log(cleanText(passageText));
        setPassage(generatePassageJSX(passageAyatRef.current, indexRef.current));
        console.log("Fetch complete. Setting loading to false.");
        setLoading(false);
      }
    }
  };

  const blankAyah = (ayahText) => {
    let string = ayahText.replace(/[A-Za-z]/g, '.');
    //string = string.replace(/[!"?,\[\]\-;:']/g, '');
    return string;
  }

  // Function to generate JSX elements for the passage
  const generatePassageJSX = (passageAyat, end) => {
    // Create an array of <span> elements with styles
    const passageJSX = [];
    
    // Loop through the elements
    for (let index = 0; index < end; index++) {
      const ayah = passageAyat[index];
      passageJSX.push(
        <span key={index} style={{ color: passageAyat[index].colour }}>
          {ayah.text}{'۞ '}
        </span>
      );
    }
    
    if (end < passageAyat.length) {
      // Current Ayah to be guessed
      const blankedAyah = blankAyah(passageAyat[end].text);
      passageJSX.push(
        <span key={end} style={{ color: 'turquoise' }}>
          {blankedAyah}{'۞ '}
        </span>
      );
    
      for (let index = end+1; index < passageAyat.length; index++) {
        // Add the "This is the end of passage" string after the passageJSX
        const blankedAyah = blankAyah(passageAyat[index].text);
        passageJSX.push(
          <span key={index} style={{ color: 'white' }}>
            {blankedAyah}{'۞ '}
          </span>
        );
      }
    }

    return passageJSX;
  };

  const handleUserSelection = (selectedAyahNumber) => {
    const correctAyahNumber = passageAyatRef.current[indexRef.current].ayahNumber;
    const isMutashabih = mutashabihatGroups.some(group =>
      group.includes(selectedAyahNumber) && group.includes(correctAyahNumber)
    );
    const isDirectMatch = selectedAyahNumber === correctAyahNumber;

    if (isDirectMatch || isMutashabih) {
      // Correct choice
      console.log("correct")
      pointsAdded.current += stepForPtsAdded;

      if (firstGuess) {
        for (let i=0; i<indexRef.current; i++) {
          // Directly modify the property (this does change the content)
          passageAyatRef.current[i].colour = "lightgreen";
          // Create a new array with the updated content
          setPassageAyat([...passageAyatRef.current]);
        }
        firstGuess = false;
      }

      const newValue = indexRef.current + 1;
      indexRef.current = newValue; // Update reference
      setIndexToBeGuessed(newValue); // Update state

      // Directly modify the property (this does change the content)
      passageAyatRef.current[indexRef.current-1].colour = "lightgreen";
      // Create a new array with the updated content
      setPassageAyat([...passageAyatRef.current]);


      setPassage(generatePassageJSX(passageAyatRef.current, indexRef.current));

      attemptsRef.current = 3;
      setAttempts(3);
      
      setNotification('Correct! Now what\'s the next ayat?');
      setShowNotification(true);

      // Clear any existing timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout to hide the notification after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setShowNotification(false);
      }, 5000); // 5000 ms = 5 seconds

    } else {
      // Incorrect choice
      console.log("incorrect")
      pointsDeducted.current += stepForPtsDeducted;

      if (attemptsRef.current > 1) {
        attemptsRef.current -= 1;
        setAttempts(attemptsRef.current);

        setNotification(`Incorrect! Please try again. ${attemptsRef.current} attempts remaining. (-20 points)`);
        setShowNotification(true);

        // Clear any existing timeout if it exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout to hide the notification after 5 seconds
        timeoutRef.current = setTimeout(() => {
          setShowNotification(false);
        }, 5000); // 5000 ms = 5 seconds

      } else {
        // out of attempts
        if (firstGuess) {
          for (let i=0; i<indexRef.current; i++) {
            // Directly modify the property (this does change the content)
            passageAyatRef.current[i].colour = "lightcoral";
            // Create a new array with the updated content
            setPassageAyat([...passageAyatRef.current]);
          }
          firstGuess = false;
        }

        const newValue = indexRef.current + 1;
        indexRef.current = newValue; // Update reference
        setIndexToBeGuessed(newValue); // Update state

        // Directly modify the property (this does change the content)
        passageAyatRef.current[indexRef.current-1].colour = "lightcoral";
        // Create a new array with the updated content
        setPassageAyat([...passageAyatRef.current]);


        setPassage(generatePassageJSX(passageAyatRef.current, indexRef.current));

        attemptsRef.current = 3;
        setAttempts(3);

        setNotification('Incorrect! Try the next ayat. (-20 points)');
        setShowNotification(true);

        // Clear any existing timeout if it exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout to hide the notification after 5 seconds
        timeoutRef.current = setTimeout(() => {
          setShowNotification(false);
        }, 5000); // 5000 ms = 5 seconds
      }
    }
  
    // Check if the passage is complete
    if (indexRef.current >= passageAyatRef.current.length) {
      setCompletedPassage(true);
      if (currentQuestionRef.current == 3) {
        setNotification('Now click "Finish" to get your results.');
        setShowNotification(true);
      } else {
        setNotification('Now click "Next" to get your next question.');
        setShowNotification(true);
      }
    }
  };
  
  // Function to manually close the notification
  const closeNotification = () => {
    setShowNotification(false);
  };

  // Define the event handler function
  const ayahItemClickHandler = (event) => {
    const target = event.target.closest('.ayah-item');
    if (target) {
      const ayahNumber = target.getAttribute('data-ayah-number');
      handleUserSelection(parseInt(ayahNumber));
    }
  };

  // const handleSearch = async (input) => {
  //   setSearchText(input);
  
  //   // Hide suggestions if input is less than 3 characters
  //   if (input.trim().length < 3) {
  //     console.log("Input is less than 3 characters. Hiding suggestions.");
  //     document.getElementById("suggestions").classList.add("hidden");
  //     return;
  //   }
    
  //   try {
  //     // Show a loading message
  //     const suggestionsElement = document.getElementById("suggestions");
  //     suggestionsElement.innerHTML = `<li class="no-results">Searching...</li>`;
  //     suggestionsElement.classList.remove("hidden");
  
  //     // Fetch results from the Quran API
  //     const response = await fetch(`http://api.alquran.cloud/v1/search/${input}/all/en.sahih`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       const matches = data?.data?.matches || [];

  //       // Check if there are matches
  //       if (matches.length > 0) {
          
  //         // Store the first 10 Ayah numbers
  //         const ayahNumbers = matches.slice(0, 10).map((match) => match.number);

  //         // Fetch and display the English versions of the ayats
  //         const ayahDetails = await Promise.all(
  //           ayahNumbers.map(async (ayahNumber) => {
  //             try {
  //               const ayahResponse = await fetch(`http://api.alquran.cloud/v1/ayah/${ayahNumber}/en.sahih`);
  //               if (ayahResponse.ok) {
  //                 const ayahData = await ayahResponse.json();
  //                 const ayahText = ayahData.data.text; // English text
  //                 const surahName = "Surah "+ayahData.data.surah.englishName; // English Surah name
  //                 return { ayahText, surahName }; // Return both text and surah name
  //               } else {
  //                 return { ayahText: `Error fetching Ayah ${ayahNumber}`, surahName: "" };
  //               }
  //             } catch (error) {
  //               return { ayahText: `Error fetching Ayah ${ayahNumber}`, surahName: "" };
  //             }
  //           })
  //         );

  //         suggestionsElement.innerHTML = "";

  //         // Display the results in the suggestions box
  //         ayahDetails.forEach(({ ayahText, surahName }, index) => {
  //           const listItem = document.createElement("li");
  //           listItem.classList.add("ayah-item"); // Adding a specific class for identification
  //           listItem.setAttribute('data-ayah-number', ayahNumbers[index]); // Store Ayah number in a data attribute
            
  //           const cleanedSurahName = cleanText(surahName);
  //           // Setting the HTML content of the list item, with an inline onClick handler
  //           listItem.innerHTML = `
  //             <p style="direction: "ltr">${ayahText}</p>
  //             <p style="color: gray; font-size: smaller;">${cleanedSurahName}</p>
  //           `;
            
  //           suggestionsElement.appendChild(listItem);
  //         });

  //         // Add a message for more results
  //         if (matches.length > 10) {
  //           suggestionsElement.innerHTML += `
  //             <li class="no-results">
  //               We have displayed the first 10 results. For more results, please sepcify your search further.
  //             </li>`;
  //         }

  //       } else {
  //         suggestionsElement.innerHTML = `<li class="no-results">No results found, try again.</li>`;
  //       }
  //     } else {
  //       suggestionsElement.innerHTML = `<li class="no-results">No results found, try again.</li>`;
  //     }

  //   } catch (error) {
  //     document.getElementById("suggestions").innerHTML = `<li class="no-results">No results found, try again.</li>`;
  //   }
  // };

  const handleSearch = (input) => {
    setSearchText(input);
  
    const isMobile = window.innerWidth <= 768;
    const suggestionsElement = document.getElementById(isMobile ? "suggestions2" : "suggestions");

    // Hide suggestions if input is less than 3 characters
    if (input.trim().length < 3) {
      console.log("Input is less than 3 characters. Hiding suggestions.");
      suggestionsElement.classList.add("hidden");
      return;
    }
  
    // Show loading message
    suggestionsElement.innerHTML = `<li class="no-results">Searching...</li>`;
    suggestionsElement.classList.remove("hidden");
  
    // Perform the search in the local JSON
    const matches = quranData.filter(item =>
      normaliseArabicInput(item.text).includes(normaliseArabicInput(input)) || (item.translation.toLowerCase()).includes(input.toLowerCase())
    ).slice(0, 50); // Limit to first 50 matches
  
    // Clear the list
    suggestionsElement.innerHTML = "";
    let listCount = 0;
  
    if (matches.length > 0) {
      matches.forEach((match) => {
        // Check if this ayah is in any mutashabihat group
        const inGroup = mutashabihatGroups.find(group => group.includes(match.number));
        const isFirstInGroup = inGroup ? inGroup[0] === match.number : true;
        
        // Skip if not the first in a group
        if (!inGroup || isFirstInGroup) {
          if (listCount < 10) {
            const listItem = document.createElement("li");
            listItem.classList.add("ayah-item");
            listItem.setAttribute('data-ayah-number', match.number);
      
            listItem.innerHTML = `
              <p>${match.translation}</p>
              <p style="color: gray; font-size: smaller;">${match.surahTranslation}</p>
            `;
      
            suggestionsElement.appendChild(listItem);
          }
          listCount++;
        }
      });
  
      // Add message if more exist (but we’re only showing 10)
      if (listCount > 10) {
        suggestionsElement.innerHTML += `
          <li class="no-results">
            We have displayed the first 10 results. For more results, please sepcify your search further.
          </li>`;
      }
    } else {
      suggestionsElement.innerHTML = `<li class="no-results">No results found, try again.</li>`;
    }
  };

  // Function to handle keyboard key presses
  const handleKeyboardInput = (keyValue) => {
    const searchInput = document.getElementById('search-input');
    
    // Check if it's a backspace key
    if (keyValue === '⌦') {
      // Remove the last character
      searchInput.value = searchInput.value.slice(0, -1);
    } else if (keyValue === 'space') {
      searchInput.value += ' ';
    } else {
      // Append the clicked key's value to the input field
      searchInput.value += keyValue;
    }
    
    // Manually trigger the handleSearch function
    handleSearch(searchInput.value);
  };

  const normaliseArabicInput = (input) => {
    let output = cleanText(input);
    return output.replace(/[أإآ]/g, 'ا').replace(/ه/g, 'ة').replace(/ت/g, 'ة');
  };

  // Speech recognition setup
  const startSpeechRecognition = () => {
    if (!window.webkitSpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText((prev) => {
        const updatedText = prev === '' ? prev + transcript : prev + " " + transcript;
        handleSearch(updatedText);
        return updatedText;
      });
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  const handleClear = () => {
    const inputElement = document.getElementById('search-input');
    inputElement.value = ''; // Clear the input field
    handleSearch(''); // Optionally trigger search with an empty string
    setSearchText('');
  };  

  const handleNextQuestion = () => {
    if (currentQuestionRef.current < 3) {
      handleClear();
      const newValue = currentQuestionRef.current + 1;
      currentQuestionRef.current = newValue;
      setCurrentQuestion(newValue);
      const newPassage = '';
      passageRef.current = newPassage;
      setPassage(newPassage);
      passageAyatRef.current = [];
      setPassageAyat([]);
      indexRef.current = 1;
      setIndexToBeGuessed(1);
      firstGuess = true;
      fetchPassage(); // Fetch a new random passage
      setCompletedPassage(false);
    } else {
      // Stop the timer
      setIsRunning(false); 
      
      // Calculate score (1000 - elapsed time in seconds)
      const elapsedTimeInSeconds = timer;
      const score = (1000 + pointsAdded.current) - (elapsedTimeInSeconds + pointsDeducted.current);
      
      // Navigate to results page and pass
      navigate("/results", { 
        state: { 
          back: "english",
          score,
          stepForPtsDeducted,
          stepForPtsAdded,
          time: elapsedTimeInSeconds, 
          pointsDeducted: pointsDeducted.current,
          pointsAdded: pointsAdded.current
        } 
      });
    }
  };

  const toggleKeyboard = () => {
    const arabicKeyboard = document.querySelector(".keyboard-container");
    const englishKeyboard = document.querySelector(".english-keyboard-container");
    const button = document.querySelector(".toggle-keyboard-btn");
  
    if (arabicKeyboard && englishKeyboard && button) {
      const isArabicHidden = arabicKeyboard.classList.contains("hidden");
  
      // Toggle visibility
      arabicKeyboard.classList.toggle("hidden");
      englishKeyboard.classList.toggle("hidden");
  
      // Update button label
      button.textContent = isArabicHidden ? "Switch to English" : "Switch to Arabic";
      language.current = isArabicHidden ? "ar-SA" : "en-GB";
    }
  };
  
    // Use useEffect to manage event listener once when component mounts
    useEffect(() => {
      if (completedPassage) return;
  
      const suggestionsElement = document.getElementById("suggestions2");
  
      // Attach event listener on mount
      suggestionsElement.addEventListener("click", ayahItemClickHandler);
  
      // Cleanup event listener on unmount
      return () => {
        suggestionsElement.removeEventListener("click", ayahItemClickHandler);
      };
    }, [completedPassage]); // Empty dependency array ensures this effect runs only once when the component mounts  

   // Use useEffect to manage event listener once when component mounts
   useEffect(() => {
    if (completedPassage) return;

    const suggestionsElement = document.getElementById("suggestions");

    // Attach event listener on mount
    suggestionsElement.addEventListener("click", ayahItemClickHandler);

    // Cleanup event listener on unmount
    return () => {
      suggestionsElement.removeEventListener("click", ayahItemClickHandler);
    };
  }, [completedPassage]); // Empty dependency array ensures this effect runs only once when the component mounts

  useEffect(() => {
    document.title = "English Hifdh Test"; // Set dynamic title
  
    // Check if the passage should be fetched
    if (!loading && selectedJuzz && selectedJuzz.length > 0 && !fetchCalledRef.current) {
      fetchCalledRef.current = true;  // Mark as called
      fetchPassage();
    }
  
    // Attach event listeners to all keyboard keys
    const keys = document.querySelectorAll('.key');
    const handleClick = (e) => {
      const keyValue = e.target.textContent;
      handleKeyboardInput(keyValue); // Call the handler function with the clicked key
    };
  
    keys.forEach((key) => {
      key.addEventListener('click', handleClick);
    });
  
    // Cleanup the event listeners when the component is unmounted or when dependencies change
    return () => {
      keys.forEach((key) => {
        key.removeEventListener('click', handleClick);
      });
    };
  
  }, [selectedJuzz, loading]); // Dependencies include selectedJuzz and loading

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);
  

  return (
    <div>
      <header className="App-header">
        <Link to="/home" className="Back-button">
          Back
        </Link>

        {/* Timer Display */}
        <div className="timer-display">⏱ {formatTime(timer)}</div>

        <div className="question-tracker">
          Question {currentQuestion} of 3
        </div>

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

        <div className="type-container">
          {/* Searchbar */}
          <div className="english-search-container">
            {/* Clear Button */}
            <button className="english-clear-button" onClick={() => handleClear()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95 1.414-1.414 4.95 4.95z" />
              </svg>
            </button>
            <input
              type="text"
              id="search-input"
              value={searchText}
              placeholder="Please search in English or Arabic for the next Ayah"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button 
              className={`english-mic-button ${isListening ? "active" : ""}`} 
              onClick={startSpeechRecognition}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mic-icon">
                <path d="M13 2C11.9 2 11 2.9 11 4V12C11 13.1 11.9 14 13 14C14.1 14 15 13.1 15 12V4C15 2.9 14.1 2 13 2ZM7 10V12C7 15.31 9.69 18 13 18C16.31 18 19 15.31 19 12V10H17V12C17 14.21 15.21 16 13 16C10.79 16 9 14.21 9 12V10H7ZM11 19V22H15V19H11Z" />
              </svg>
            </button>
            <ul className="suggestions-list hidden" id="suggestions"></ul>
          </div>
          <button onClick={toggleKeyboard} className="toggle-keyboard-btn">
            Switch to Arabic
          </button>
          <div className="keyboard-container hidden">
            {/* Keyboard */}
            <div className="keyboard-row">
              {/* Row 1 */}
              <button className="key">ج</button>
              <button className="key">ح</button>
              <button className="key">خ</button>
              <button className="key">ه</button>
              <button className="key">ع</button>
              <button className="key">غ</button>
              <button className="key">ف</button>
              <button className="key">ق</button>
              <button className="key">ث</button>
              <button className="key">ص</button>
              <button className="key">ض</button>
            </div>
            <div className="keyboard-row">
              {/* Row 2 */}
              <button className="key">ة</button>
              <button className="key">ك</button>
              <button className="key">م</button>
              <button className="key">ن</button>
              <button className="key">ت</button>
              <button className="key">ا</button>
              <button className="key">ل</button>
              <button className="key">ب</button>
              <button className="key">ي</button>
              <button className="key">س</button>
              <button className="key">ش</button>
            </div>
            <div className="keyboard-row">
              {/* Row 3 */}
              <button className="key">ى</button>
              <button className="key">و</button>
              <button className="key">ر</button>
              <button className="key">ز</button>
              <button className="key">د</button>
              <button className="key">ذ</button>
              <button className="key">ط</button>
              <button className="key">ظ</button>
              <button className="key">ء</button>
            </div>
            <div className="keyboard-row">
              {/* Row 4 */}
              <button className="key">أ</button>
              <button className="key">إ</button>
              <button className="key">آ</button>
              <button className="key">ؤ</button>
              <button className="key">ئ</button>
            </div>
            <div className="keyboard-row">
              {/* Row 4 */}
              <button className="key">ۖ</button>
              <button className="key">ۗ</button>
              <button className="key">ۘ</button>
              <button className="key">ۙ</button>
              <button className="key">ۚ</button>
              <button className="key">ۛ</button>
              <button className="key">ۜ</button>
              <button className="key space">مسافة</button>
              <button className="key backspace">⌦</button>
            </div>
          </div>
          <div className="english-keyboard-container">
            {/* Keyboard */}
            <div className="keyboard-row">
              {/* Row 1 */}
              <button className="key">q</button>
              <button className="key">w</button>
              <button className="key">e</button>
              <button className="key">r</button>
              <button className="key">t</button>
              <button className="key">t</button>
              <button className="key">y</button>
              <button className="key">u</button>
              <button className="key">i</button>
              <button className="key">o</button>
              <button className="key">p</button>
            </div>
            <div className="keyboard-row">
              {/* Row 2 */}
              <button className="key">a</button>
              <button className="key">s</button>
              <button className="key">d</button>
              <button className="key">f</button>
              <button className="key">g</button>
              <button className="key">h</button>
              <button className="key">j</button>
              <button className="key">k</button>
              <button className="key">l</button>
            </div>
            <div className="keyboard-row">
              {/* Row 3 */}
              <button className="key">z</button>
              <button className="key">x</button>
              <button className="key">c</button>
              <button className="key">v</button>
              <button className="key">b</button>
              <button className="key">n</button>
              <button className="key">m</button>
            </div>
            <div className="keyboard-row">
              {/* Row 4 */}
              <button className="key">.</button>
              <button className="key">,</button>
              <button className="key">[</button>
              <button className="key">]</button>
              <button className="key">"</button>
              <button className="key">;</button>
              <button className="key">-</button>
              <button className="key space">space</button>
              <button className="key backspace">⌫</button>
            </div>
          </div>
        </div>
        <ul className="mobile-suggestions-list hidden" id="suggestions2"></ul>

        <div className="english-passage-container">
        {loading && <div className="loading-spinner"></div>}
        {error && <div>{error}</div>}
        {!loading && passage && (
          <div className="passage-text">{passage}</div>
        )}
        </div>

        {/* Next button */}
        {completedPassage && (
          <button onClick={handleNextQuestion} className="next-button">
            {currentQuestion < 3 ? "Next" : "Finish"}
          </button>
        )}
      </header>
    </div>
  );
}

export default EnglishQuestions;
