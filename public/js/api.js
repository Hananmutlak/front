const API_BASE = 'https://restaurant-backend-1-68of.onrender.com//api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiRequest(path, method = 'GET', body) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  };
  
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Server error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('Connection error with the server:', error);
    throw error;
  }
}
