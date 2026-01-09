import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  
  return {
    accessToken: token,
    role: role,
    isAuthenticated: !!token,
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, role } = action.payload;
      state.accessToken = accessToken;
      state.role = role;
      state.isAuthenticated = true;
      
      localStorage.setItem('accessToken', accessToken);
      if (role) localStorage.setItem('role', role);
    },

    logout: (state) => {
      state.accessToken = null;
      state.role = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;