# 🕋 Quran Memorisation Game – Hifdh Assistant

This is a gamified web application built to aid and test Quran memorisation (Hifdh) through interactive game modes. It was developed as part of a university software engineering project, combining real-world feedback, modern web technologies, and classical HCI principles. It includes Arabic and English memorisation modes, dynamic passage generation, voice recognition, phonetic search, and a themed Hangman game for Surah names.

---

## 🌟 Features

### 🔠 **Arabic Hifdh Mode**
- Randomised passage generation from selected Juzz.
- Adaptive passage length with fair Ayah selection.
- Phonetic Arabic search bar (e.g., typing `b` yields "ب").
- Speech recognition integration.
- Real-time input validation and feedback (green/red colour feedback).
- Results screen with scoring and replay options.

### 📖 **English Hifdh Mode**
- Full Ayah display (no partial blanking).
- Similar passage logic but adapted for translated text difficulty.

### 🕹️ **Quranic Hangman**
- 114 Surah names included.
- Arabic display with filtered definitive particles.
- Custom character filtering logic for fair gameplay.
- Desert-themed hangman with Islamic attire.

---

## 💡 Technical Highlights

- **Frontend**: React, Tailwind CSS
- **Search Logic**: Local JSON (`quran.json`) + custom phonetics + diacritic-insensitive search
- **Passage Generation**: Boundary-tested random selection with Ayah alignment
- **Voice Recognition**: Browser Web Speech API
- **Gameflow Optimisation**: Loading states, transition control, and passage integrity
- **Testing**:
  - Boundary testing (Juzz size, Ayah overflow)
  - Gameflow validation (next/prev screens, scoring consistency)
  - Input scenarios (incorrect guesses, speech input, single Juzz selection)

---

## 🧪 User Testing

Passage lengths and difficulty were refined via iterative testing and consultations with Quran memorizers. The interface was evaluated for natural flow, interaction timing, and clarity, especially across different devices.

---

## 🛠️ Setup

### 📁 Requirements

- Node.js ≥ 16
- NPM or Yarn

### 🔧 Installation

```bash
git clone https://github.com/your-username/quran-hifdh-game.git
cd quran-hifdh-game
npm install
npm start


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
