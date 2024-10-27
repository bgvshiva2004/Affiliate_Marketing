const BASE_URL = "http://localhost:8000" + '/api/v1';

async function apiCall(endpoint, params = {}, token = null, options = {}) {
  const url = `${BASE_URL}/${endpoint}/`;
  
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });

  const fullUrl = `${url}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const requestOptions = {
    cache: 'no-store',
    headers,
    ...options
  };

  try {
    const response = await fetch(fullUrl, requestOptions);
    
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

export function getAllProducts(token = null, params = {}, options = {}) {
  return apiCall('products', params, token, options);
}

export function getAllNotes(token = null, params = {}, options = {}) {
  return apiCall('notes', params, token, options);
}
