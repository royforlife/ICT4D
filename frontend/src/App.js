import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import QuestionForm from './components/QuestionForm';
import SearchBar from './components/SearchBar';
import Question from './components/Question';
import { getQuestions } from './utils/api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // write registerForm
    const [registerForm, setRegisterForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const questions = await getQuestions(searchKeyword);
      setQuestions(questions);
    };

    fetchData();
  }, [searchKeyword]);

  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleRegister = () => {
    setRegisterForm(true);
  }

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <div className="container">
      <header>
        <h1>Q&A Website</h1>
        {!loggedIn && <LoginForm onLogin={handleLogin} />}
        {!loggedIn && <RegisterForm onRegister={handleRegister} />}
      </header>

      <SearchBar onSearch={handleSearch} />

      {loggedIn && <QuestionForm onQuestionAdded={() => handleSearch(searchKeyword)} />}

      {/*{questions.map((question) => (*/}
      {/*  <Question key={question.id} question={question} />*/}
      {/*))}*/}
      {Array.isArray(questions["questions"]) ? questions["questions"].map((question) => (
          <Question key={question.id} question={question} />
      )) : null}
    </div>
  );
}

export default App;