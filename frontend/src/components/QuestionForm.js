import React, { useState } from 'react';
import { createQuestion } from '../utils/api';

function QuestionForm({ onQuestionAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createQuestion(title, content);
      setTitle('');
      setContent('');
      onQuestionAdded();
    } catch (error) {
      console.error('Creating question failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;
