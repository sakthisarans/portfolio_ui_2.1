const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken, refreshToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
};

/**
 * Store user data in localStorage
 */
export const setUserData = (userData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
};

/**
 * Get user data from localStorage
 */
export const getUserData = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};

/**
 * Login user with email and password
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/user/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Sign up new user
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Signup failed');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Verify account with OTP
 */
export const verifyAccount = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/user/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Verification failed');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async () => {
  try {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/api/v1/user/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    
    return { success: true, data };
  } catch (error) {
    clearAuthData();
    return { success: false, error: error.message };
  }
};

/**
 * Verify if current token is valid
 */
export const verifyToken = async () => {
  try {
    const token = getAccessToken();
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/api/v1/user/token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const refresh_token = getRefreshToken();
    if (refresh_token) {
      await fetch(`${API_URL}/api/v1/user/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};
