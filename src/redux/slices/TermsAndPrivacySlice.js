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
// Async thunks
export const getTermsAndPrivacy = createAsyncThunk("TermsAndPrivacy/getTermsAndPrivacy", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getTermsAndPrivacy();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
 
// Edit User
export const editTermsAndPrivacy = createAsyncThunk("TermsAndPrivacy/editTermsAndPrivacy", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editTermsAndPrivacy(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const TermsAndPrivacySlice = createSlice({
  name: "TermsAndPrivacySlice",
  initialState: {
    termsPrivacyData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getTermsAndPrivacy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTermsAndPrivacy.fulfilled, (state, action) => {
        state.loading = false;
        state.termsPrivacyData = action.payload?.data;

      })
      .addCase(getTermsAndPrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
    
      // Edit user
      .addCase(editTermsAndPrivacy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTermsAndPrivacy.fulfilled, (state, action) => {
        state.loading = false;
        state.termsPrivacyData = action.payload.data;  
        state.message = "User updated successfully"; 
      })
      .addCase(editTermsAndPrivacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
  },
});

export default TermsAndPrivacySlice.reducer;
