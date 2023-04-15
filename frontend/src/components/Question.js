import React, { useState } from 'react';
import AnswerForm from './AnswerForm';

function Question({ question }) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const handleAnswerClick = () => {
    setShowAnswerForm(!showAnswerForm);
  };

  return (
    <div className="question">
      <h3>{question.title}</h3>
      <p>{question.content}</p>
      {question.answer && <p>{question.answer}</p>}
      {question.recording_url && (
        <audio src={question.recording_url} controls></audio>
      )}
      <button onClick={handleAnswerClick}>Answer</button>
      {showAnswerForm && <AnswerForm questionId={question.id} />}
    </div>
  );
}

export default Question;
