// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@material-ui/core';
import { AuthForm, QuestionForm } from './components/Forms';
import SearchBar from './components/SearchBar';
import Question from './components/Question';
import { getQuestions } from './utils/api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const questions = await getQuestions(searchKeyword);
      setQuestions(questions);
    };

    fetchData();
  }, [searchKeyword]);

  const handleAuth = () => {
    setLoggedIn(true);
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          MilaMala
        </Typography>
        {!loggedIn && <AuthForm onAuth={handleAuth} />}
        <SearchBar onSearch={handleSearch} />
        {loggedIn && (
          <QuestionForm
            onQuestionAdded={() => handleSearch(searchKeyword)}
          />
        )}
        {Array.isArray(questions['questions'])
          ? questions['questions'].map((question) => (
              <Box my={2} key={question.id}>
                <Question question={question} />
              </Box>
            ))
          : null}
      </Box>
    </Container>
  );
}

export default App;
