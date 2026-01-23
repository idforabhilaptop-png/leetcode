// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axiosClient from './utils/axiosClient';

// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (userData, { rejectWithValue }) => {
//     try {
//       console.log('Attempting registration with:', userData);
//       const { data } = await axiosClient.post('/user/register', userData);
//       console.log('Registration successful:', data);
//       return data.user;
//     } catch (error) {
//       console.error('Registration error:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//       });
//       return rejectWithValue(
//         error.response?.data?.message || error.response?.data || 'Registration failed'
//       );
//     }
//   }
// );
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosClient.post('/user/login', credentials);
//       return data.user;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Login failed'
//       );
//     }
//   }
// );

// export const checkAuth = createAsyncThunk(
//   'auth/check',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosClient.get('/user/check');
//       return data.user;
//     } catch (error) {
//       if (error.response?.status === 401) {
//         return rejectWithValue(null); // not logged in
//       }
//       return rejectWithValue(
//         error.response?.data?.message || 'Auth check failed'
//       );
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await axiosClient.post('/user/logout');
//       return null;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Logout failed'
//       );
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // REGISTER
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // LOGIN
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // CHECK AUTH
//       .addCase(checkAuth.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.loading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//         state.error = action.payload; // null if 401
//       })

//       // LOGOUT
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export default authSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

/* ===================== THUNKS ===================== */

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/user/register', userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Registration failed'
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/user/login', credentials);
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Login failed'
      );
    }
  }
);

// CHECK AUTH (on refresh)
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null); // not logged in
      }
      return rejectWithValue(
        error.response?.data || 'Auth check failed'
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Logout failed'
      );
    }
  }
);

/* ===================== SLICE ===================== */

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    authChecked: false, // 🔑 VERY IMPORTANT
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* -------- REGISTER -------- */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- LOGIN -------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- CHECK AUTH -------- */
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.error = action.payload;
      })

      /* -------- LOGOUT -------- */
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

