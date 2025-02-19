import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";


// For Unauthenticated User
function logouterror() {
  toast.error("Token Expired")
  localStorage.removeItem("nfc-admin");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}

export const getAboutTagis = createAsyncThunk("aboutTagis/getAboutTagis", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAboutTagis();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Edit User
export const editAboutTagis = createAsyncThunk("aboutTagis/editAboutTagis", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editAboutTagis(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const aboutTagisSlice = createSlice({
  name: "aboutTagisSlice",
  initialState: {
    aboutUsData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAboutTagis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAboutTagis.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsData = action.payload.data;

      })
      .addCase(getAboutTagis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
    
      // Edit user
      .addCase(editAboutTagis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAboutTagis.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsData = action.payload.data;  
        state.message = "User updated successfully"; 
      })
      .addCase(editAboutTagis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
  },
});

export default aboutTagisSlice.reducer;
