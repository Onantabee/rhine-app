import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userEmail: null,
    userName: null,
    userRole: null,
    searchTerm: '',
    sessionChecked: false, // whether /users/me has been called at least once
};

// Load initial state from sessionStorage (used as a fast cache for UI, server session is the source of truth)
const loadInitialState = () => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            return {
                isLoggedIn: parsed.isLoggedIn || false,
                userEmail: parsed.email || null,
                userName: parsed.name || null,
                userRole: parsed.userRole || null,
                searchTerm: '',
                sessionChecked: false, // always re-validate server session on load
            };
        } catch (error) {
            console.error('Failed to parse user from sessionStorage:', error);
            return initialState;
        }
    }
    return initialState;
};

const authSlice = createSlice({
    name: 'auth',
    initialState: loadInitialState(),
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userEmail = action.payload.email;
            state.userName = action.payload.name || null;
            state.userRole = action.payload.userRole || null;
            state.sessionChecked = true;

            // Sync to sessionStorage
            sessionStorage.setItem('user', JSON.stringify({
                isLoggedIn: true,
                email: action.payload.email,
                name: action.payload.name,
                userRole: action.payload.userRole,
            }));
        },

        logout: (state) => {
            state.isLoggedIn = false;
            state.userEmail = null;
            state.userName = null;
            state.userRole = null;
            state.searchTerm = '';
            state.sessionChecked = true;

            // Clear sessionStorage
            sessionStorage.removeItem('user');
        },

        updateUser: (state, action) => {
            if (action.payload.name !== undefined) {
                state.userName = action.payload.name;
            }
            if (action.payload.userRole !== undefined) {
                state.userRole = action.payload.userRole;
            }

            // Sync to sessionStorage
            const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
            sessionStorage.setItem('user', JSON.stringify({
                ...storedUser,
                name: state.userName,
                userRole: state.userRole,
            }));
        },

        setSessionChecked: (state) => {
            state.sessionChecked = true;
        },

        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
});

export const { login, logout, updateUser, setSessionChecked, setSearchTerm } = authSlice.actions;
export default authSlice.reducer;
