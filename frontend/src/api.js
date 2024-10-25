const BASE_URL = "http://localhost:8000" + '/api/v1';

async function apiCall(endpoint, params = {}) {
  const url = `${BASE_URL}/${endpoint}/`;
  
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });

  const fullUrl =  `${url}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;


  try {
    const response = await fetch(fullUrl,{ cache: 'no-store' });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:, error`);
    throw error;
  }
}

export function getAllProducts(params={}){
    return apiCall('products',params)
}

// export function signUpSubmit(params={}){
//   return apiCall('signup',params)
// }