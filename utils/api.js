import axios from 'axios';
import { getAccessToken, refreshToken, clearAuthData } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const result = await refreshToken();

                if (result.success) {
                    // Retry the original request with new token
                    const token = getAccessToken();
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                } else {
                    // Refresh failed, clear auth and redirect to login
                    clearAuthData();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                clearAuthData();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

// API helper functions

/**
 * Get portfolio data (public endpoint)
 */
export const getPortfolio = async (domain) => {
    const response = await apiClient.get(`/api/v1/content/portfolio/${domain}`);
    return response.data;
};

/**
 * Get raw portfolio data for editing (requires authentication)
 */
export const getPortfolioRaw = async (domain) => {
    const response = await apiClient.get(`/api/v1/content/portfolio/${domain}/raw`);
    return response.data;
};

/**
 * Update portfolio data (requires authentication)
 */
export const updatePortfolio = async (portfolioData) => {
    // Transform the data to match API schema
    const transformedData = {
        ...portfolioData,
        // Ensure github has required fields (userid, token)
        // If github.userid is empty, use devUsername as fallback
        github: {
            userid: portfolioData.github?.userid || portfolioData.personalData?.devUsername || '',
            token: portfolioData.github?.token || '',
            defaultUrl: portfolioData.github?.defaultUrl || null
        },
        // Ensure blog config object exists
        blog: {
            url: portfolioData.blog?.url || '',
            admin_key: portfolioData.blog?.admin_key || '',
            key: portfolioData.blog?.key || ''
        }
    };

    const response = await apiClient.put('/api/v1/content/portfolio', transformedData);
    return response.data;
};

/**
 * Send chat message to LLM
 */
export const sendChatMessage = async (message, userid, chatid, chunk_size = 15) => {
    const response = await apiClient.post('/api/v1/genai/search', {
        message,
        userid,
        chatid,
        chunk_size,
    });
    return response.data;
};

/**
 * Upsert knowledge base entry (requires authentication)
 */
export const upsertKnowledge = async (knowledgeData) => {
    const response = await apiClient.post('/api/v1/content/datasource/knowledge', knowledgeData);
    return response.data;
};

/**
 * Upload document to knowledge base (requires authentication)
 */
export const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/v1/content/datasource/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Extract/Train knowledge base (requires authentication)
 */
export const extractKnowledge = async () => {
    const response = await apiClient.post('/api/v1/contentextractor/extract');
    return response.data;
};

/**
 * Get knowledge base entries (requires authentication)
 */
export const getKnowledge = async () => {
    const response = await apiClient.get('/api/v1/content/datasource/knowledge');
    return response.data;
};

/**
 * Send email via portfolio
 */
export const sendEmail = async (emailData) => {
    const response = await apiClient.post('/api/v1/sendemail', emailData);
    return response.data;
};
