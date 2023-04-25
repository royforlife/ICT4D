// src/components/Forms.js
import React, { useState } from 'react';
import { TextField, Button, FormControl, FormGroup, FormLabel } from '@material-ui/core';
import { updateQuestion, login, register, createQuestion } from '../utils/api';

// Use this as a base component, and extend it for each specific form
function BaseForm({ fields, onSubmit, submitLabel  }) {
  const [values, setValues] = useState(fields);

  const handleChange = (event, field) => {
    setValues({ ...values, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(fields).map((field) => (
        <TextField
          key={field}
          label={field}
          value={values[field]}
          onChange={(e) => handleChange(e, field)}
          margin="normal"
          variant="outlined"
        />
      ))}

     {/* set button same height with form */}
     <Button type="submit" variant="contained" color="primary" style={{height: 56 /*set location*/ }}>
        {submitLabel} {/* Use the submitLabel prop here */}
      </Button>
      
      {/* <Button type="submit" variant="contained" color="primary" >
        Submit
      </Button> */}
    </form>
  );
}

// Extend BaseForm for AnswerForm
export function AnswerForm({ questionId }) {
  const onSubmit = async ({ answer, recordingUrl }) => {
    try {
      await updateQuestion(questionId, answer, recordingUrl);
    } catch (error) {
      console.error('Updating question failed');
    }
  };

  return <BaseForm fields={{ answer: '', recordingUrl: '' }} onSubmit={onSubmit} submitLabel='Go'/>;
}

// Extend BaseForm for AuthForm
export function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);

  const onSubmit = async ({ username, password }) => {
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onAuth();
    } catch (error) {
      console.error(isLogin ? 'Login failed' : 'Register failed');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <React.Fragment>
      <BaseForm
        fields={{ username: '', password: '' }}
        onSubmit={onSubmit}
        submitLabel={isLogin ? 'Login' : 'Register'}
      />
      <Button onClick={toggleForm} variant="outlined">
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </Button>
    </React.Fragment>
  );
}

// Extend BaseForm for QuestionForm
export function QuestionForm({ onQuestionAdded }) {
  const onSubmit = async ({ title, content }) => {
    try {
      await createQuestion(title, content);
      onQuestionAdded();
    } catch (error) {
      console.error('Creating question failed');
    }
  };

  return (
    <BaseForm fields={{ title: '', content: '' }} onSubmit={onSubmit} submitLabel='Go' />
  );
}
