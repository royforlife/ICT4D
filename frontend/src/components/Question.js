// src/components/Question.js
import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Button } from '@material-ui/core';
import { AnswerForm } from './Forms';

function Question({ question }) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleAnswerClick = () => {
    setShowAnswerForm(!showAnswerForm);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{question.title}</Typography>
        <Typography variant="body1">{question.content}</Typography>
        {question.answer && <Typography variant="body2">{question.answer}</Typography>}
        {question.recording_url && (
          <audio src={question.recording_url} controls></audio>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={handleAnswerClick} variant="outlined">
          Answer
        </Button>
      </CardActions>
      {showAnswerForm && <AnswerForm questionId={question.id} />}
    </Card>
  );
}

export default Question;
