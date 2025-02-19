import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";

// Utility to check if we're in the browser environment
const isBrowser = typeof window !== "undefined";

// Login async thunk
export const login = createAsyncThunk("admin/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.login(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Logout action
export const logout = createAsyncThunk("admin/logout", async (id) => {
  try {
    const response = await api.logout(id);
    return {
      message: response.data.message,
      status: response.status,
    };
  } catch (error) {
    throw error;
  }
});

// Forgot password
// export const forgetpassword = createAsyncThunk("admin/forgot-password", async (formdata, { rejectWithValue }) => {
//   try {
//     const response = await api.forgetpassword(formdata);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });

// // Reset password
// export const resetPassword = createAsyncThunk("admin/reset-password", async (formdata, { rejectWithValue }) => {
//   try {
//     const response = await api.resetPassword(formdata);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });

// // Profile View
// export const profileView = createAsyncThunk('/admin/profileview', async (id, { rejectWithValue }) =>{
//   try {
//     const response = await api.profileView(id);
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || error.message);
//   }
// })

// // Update Profile
// export const updateProfile = createAsyncThunk('/admin/updateProfile', async ({formData, id}, { rejectWithValue }) => {
//   try {
//     const response = await api.updateUserProfile({formData, id}); 
//     return response.data;
//   } catch (error) {
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });


const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    loading: false,
    userLogedOut: isBrowser ? !localStorage.getItem("nfc-admin") : true,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login slice
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = false;
        state.admin = action.payload;
        if (typeof window !== "undefined") {
          const { id, token } = action.payload.data;
          localStorage.setItem("nfc-admin", JSON.stringify({ id, token }));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Logout slice
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.admin = null;
        state.userLogedOut = true;
        state.loading = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("nfc-admin");
        }
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        if (typeof window !== "undefined") {
          localStorage.removeItem("nfc-admin");
        }
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      })

      // Forget Password
      // .addCase(forgetpassword.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(forgetpassword.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.message = action.payload;
      // })
      // .addCase(forgetpassword.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action?.payload || "Failed to send password reset link";
      // })

      // // Reset password
      // .addCase(resetPassword.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(resetPassword.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.message = action.payload;
      // })
      // .addCase(resetPassword.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })
     
      // // Profile View
      // .addCase(profileView.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(profileView.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.admin = action.payload?.data;
      // })
      // .addCase(profileView.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   window.location.href = '/';
      //   localStorage.removeItem("nfc-admin");
      // })

      // // update Profile
      // .addCase(updateProfile.pending, (state) =>{
      //   state.loading = true;
      // })
      // .addCase(updateProfile.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.message = action.payload.message;
      // })
      // .addCase(updateProfile.rejected, (state, action) =>{
      //   state.loading = false;
      //   state.error = action.payload;
      //   window.location.href = '/';
      //   localStorage.removeItem("nfc-admin");
      // })
      
  },
});

export default authSlice.reducer;