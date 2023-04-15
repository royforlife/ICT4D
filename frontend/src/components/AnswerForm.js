import React, { useState } from 'react';
import { updateQuestion } from '../utils/api';

function AnswerForm({ questionId }) {
  const [answer, setAnswer] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateQuestion(questionId, answer, recordingUrl);
      setAnswer('');
      setRecordingUrl('');
    } catch (error) {
      console.error('Updating question failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      ></textarea>
      <input
        type="url"
        placeholder="Recording URL"
        value={recordingUrl}
        onChange={(e) => setRecordingUrl(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default AnswerForm;
