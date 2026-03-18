// src/utils/constants.js

export const BASE_URL = 'http://localhost:8000/api'

export const API_ENDPOINTS = {
    LOGIN: '/user/login/',
    SIGNUP: '/user/signup/',
    LOGOUT: '/user/logout/',
    PROFILE: '/user/profile/',
    USER: '/user/',
};

export const ROLES = {
    USER: 'user',
    VERIFIER: 'verifier',
};

export const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिन्दी)' },
    { code: 'mr', label: 'Marathi (मराठी)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'bn', label: 'Bengali (বাংলা)' },
];