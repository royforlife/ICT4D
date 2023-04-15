const API_BASE_URL = 'http://127.0.0.1:4000';

async function fetchWrapper(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error(response.status);
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


export async function getQuestions(keyword = '') {
  return fetchWrapper(
    `${API_BASE_URL}/question?page=1&params=${encodeURIComponent(keyword)}`
    // `${API_BASE_URL}/question?page=1`
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
