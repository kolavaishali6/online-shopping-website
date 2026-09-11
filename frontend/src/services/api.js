// API client wrapper for full-stack communication

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const storedUser = localStorage.getItem('userInfo');
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.token) {
        headers['Authorization'] = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('Error reading token from localStorage', e);
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: async (url) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (url, body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (url, body) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export default api;
