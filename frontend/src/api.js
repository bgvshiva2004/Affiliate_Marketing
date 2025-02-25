  const BASE_URL = "http://127.0.0.1:8000/backend" + '/api/v1';

  async function apiCall(endpoint, params = {}, token = null, options = {}) {
    const url = `${BASE_URL}/${endpoint}/`;
    
    const queryParams = new URLSearchParams();
    
    // Object.entries(params).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null) {
    //     queryParams.append(key, value);
    //   }
    // });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {

          if (Array.isArray(value) && value.length > 0) {
              queryParams.append(key, value.join(','));
          } 
          else if (value !== '' && !Array.isArray(value)) {
              queryParams.append(key, value);
          }
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

    const normalizedParams = {
      q: params.searchTerm,
      categories: params.categories,
      countries: params.countries,
      platforms: params.platforms,
      min_price: params.min_price,
      max_price: params.max_price,
      product_category: params.categories?.join(','),
      product_country: params.countries?.join(','),
      product_platform: params.platforms?.join(','),
      q: params.searchTerm,
      ...params
    }
    return apiCall('products', normalizedParams, token, options);
  }

  export function getAllNotes(token = null, params = {}, options = {}) {
    return apiCall('lists', params, token, options);
  }

  export function getSearchProducts(query , token = null, params = {} , options = {}){
    return apiCall('products' , {
      q : query,
      ...params
    } , token , options);
  }