// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { AuthForm, QuestionForm } from './components/Forms';
import SearchBar from './components/SearchBar';
import Question from './components/Question';
import { getQuestions } from './utils/api';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);  // new state for the user


  const fetchData = async (pageNum) => {
    try {
      const questions = await getQuestions(searchKeyword, pageNum);
      setQuestions(questions);
      setError(null);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [searchKeyword, page]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userData = JSON.parse(loggedInUser);
    if (userData && userData.loggedIn) {
      setLoggedIn(true);
      setUser(userData.user);
    }
  }, []);

  const handleAuth = (userData) => {
    setLoggedIn(true);
    setUser(userData);
    // print out the user data
    console.log(userData);
    localStorage.setItem('loggedInUser', JSON.stringify({ loggedIn: true, user: userData }));
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          MaliMala
        </Typography>
        {user && <Typography variant="h6">Current User: {user.username}</Typography>}
        {!loggedIn && !user && <AuthForm onAuth={handleAuth} />}
        {loggedIn && (
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        )}
        <SearchBar onSearch={handleSearch} />
        {loggedIn && (
          <QuestionForm onQuestionAdded={() => handleSearch(searchKeyword)} />
        )}
        {Array.isArray(questions['questions'])
          ? questions['questions'].map((question) => (
              <Box my={2} key={question.id}>
                <Question question={question} />
              </Box>
            ))
          : null}
        <Box
          my={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="primary"
            disabled={page === 1}
            onClick={() => fetchData(Math.max(page - 1, 1))}
          >
            Previous Page
          </Button>
          <Typography variant="h6">Page: {page}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchData(page + 1)}
          >
            Next Page
          </Button>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="error"
            onClose={() => setError(null)}
          >
            {error}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default App;
