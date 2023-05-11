// const API_BASE_URL = 'http://127.0.0.1:4000';

// get API_BASE_URL from .env only if process.env.REACT_APP_API_BASE_URL is defined
// otherwise, use default value 'http://127.0.0.1:4000'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4000'

async function fetchWrapper(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error(`No more questions found`);
  }
}


export async function register(username, password) {
  return fetchWrapper(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function login(username, password) {
  return fetchWrapper(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

}



export async function getQuestions(keyword = '', page = 1) {
  return fetchWrapper(
    `${API_BASE_URL}/question?page=${page}&params=${encodeURIComponent(keyword)}`
  );
}


export async function createQuestion(title, content) {
  return fetchWrapper(`${API_BASE_URL}/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
}

export async function updateQuestion(id, answer, recording_url) {
  return fetchWrapper(`${API_BASE_URL}/question`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, answer, recording_url }),
  });
}
