import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/setCredentials', 'auth/logout'],
                ignoredPaths: ['auth.user', 'auth.token'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production', // Disable DevTools in production
});

// Listen to store changes for token persistence
store.subscribe(() => {
    const state = store.getState();
    const token = state.auth.token;
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
});