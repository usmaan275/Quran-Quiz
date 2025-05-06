import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArabicSetup from './pages/ArabicSetup';
import EnglishSetup from './pages/EnglishSetup';
import MCQ from './pages/MCQ';
import Hangman from './pages/Hangman';
import ArabicQuestions from './pages/ArabicQuestions';
import ArabicResults from './pages/ArabicResults';
import EnglishQuestions from './pages/EnglishQuestions';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes> 
          <Route index element = {<Home/>}/>
          <Route path="/home" element ={<Home/>}/>
          <Route path="/arabic-setup" element ={<ArabicSetup/>}/>
          <Route path="/english-setup" element ={<EnglishSetup/>}/>
          <Route path="/mcq" element ={<MCQ/>}/>
          <Route path="/hangman" element ={<Hangman/>}/>
          <Route path="/arabic-questions" element ={<ArabicQuestions/>}/>
          <Route path="/results" element ={<ArabicResults/>}></Route>
          <Route path="/english-questions" element ={<EnglishQuestions/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
