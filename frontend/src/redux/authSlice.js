import { createSlice } from "@reduxjs/toolkit"

// Try to load existing session from localStorage so refresh doesn't log user out
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: storedUser ? JSON.parse(storedUser).userId : null,
    name: storedUser ? JSON.parse(storedUser).name : null,
    email: storedUser ? JSON.parse(storedUser).email : null,
    role: storedUser ? JSON.parse(storedUser).role : null,
    token: storedToken || null,
    isLoggedIn: storedToken ? true : false,
  },
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      // persist to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        })
      );
    },

    logout: (state) => {
      state.userId = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;