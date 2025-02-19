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
export const getAboutServices = createAsyncThunk("aboutServices/getAboutServices", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAboutServices();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Edit User
export const editAboutServices = createAsyncThunk("aboutServices/editAboutServices", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editAboutServices(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const aboutServices = createSlice({
  name: "aboutServices",
  initialState: {
    aboutServiceData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAboutServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAboutServices.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutServiceData = action.payload.data;

      })
      .addCase(getAboutServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
    
      // Edit user
      .addCase(editAboutServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAboutServices.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutServiceData = action.payload.data;  
        state.message = "User updated successfully"; 
      })
      .addCase(editAboutServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
  },
});

export default aboutServices.reducer;
