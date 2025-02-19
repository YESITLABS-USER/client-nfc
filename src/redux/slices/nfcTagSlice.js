import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// For Unauthenticated Tag
function logouterror() {
    toast.error("Token Expired")
    localStorage.removeItem("nfc-admin");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
}
// Get All Tags
export const getAllNfcTags = createAsyncThunk("nfcTag/getAllNfcTags", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllNfcTags();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
export const getAllClients = createAsyncThunk("nfcTag/getAllClients", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllClients();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const getAllLocations = createAsyncThunk("nfcTag/getAllLocations", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getAllLocations(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
export const createNfcTag = createAsyncThunk("nfcTag/create", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createNfcTag(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Edit Tag
export const editNfcTag = createAsyncThunk("nfcTag/editNfcTag", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editNfcTag(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
// Delete Tag
export const deleteNfcTag = createAsyncThunk("nfcTag/delete", async (TagData, { rejectWithValue }) => {
  try {
    const response = await api.deleteNfcTag(TagData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Slice

const nfcTagSlice = createSlice({
  name: "NFC Tag",
  initialState: {
    nfcTags: [],
    allClients: [],
    allClientLocation: [],
    loading: false,
    client_loading: false,
    location_loading: false,
    nfcError: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Tags
      .addCase(getAllNfcTags.pending, (state) => {
        state.loading = true;
        state.nfcError = null;
      })
      .addCase(getAllNfcTags.fulfilled, (state, action) => {
        state.loading = false;  
        state.nfcTags = action.payload?.data;

      })
      .addCase(getAllNfcTags.rejected, (state, action) => {
        state.loading = false;
        state.nfcError = action.payload || "Failed to fetch Tags";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })

    //   Get All Clients
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.nfcError = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;  
        state.allClients = action.payload?.data;

      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.loading = false;
        state.nfcError = action.payload || "Failed to fetch Tags";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })
    //   Get All locations
      .addCase(getAllLocations.pending, (state) => {
        state.loading = true;
        state.nfcError = null;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.loading = false;  
        state.allClientLocation = action.payload?.data;

      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.nfcError = action.payload || "Failed to fetch Tags";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })
      
      // Create Tag
      .addCase(createNfcTag.pending, (state) => {
        state.loading = true;
        state.nfcError = null;
      })
      .addCase(createNfcTag.fulfilled, (state, action) => {
        state.loading = false;
        state.nfcTags = action.payload?.data;  
        state.message = "Tag created successfully"; 
        toast.success("Tag created successfully")
      })
      .addCase(createNfcTag.rejected, (state, action) => {
        state.loading = false;
        state.nfcError = action.payload?.errors || "Tag creation failed";
        toast.error(action.payload.message || "Tag creation failed");
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })
      
      // Edit Tag
      .addCase(editNfcTag.pending, (state) => {
        state.loading = true;
        state.nfcError = null;
      })
      .addCase(editNfcTag.fulfilled, (state, action) => {
        state.loading = false;
        state.nfcTags = action.payload?.data;  
        state.message = "Tag updated successfully"; 
        toast.success("Tag updated successfully")
      })
      .addCase(editNfcTag.rejected, (state, action) => {
        state.loading = false;
        state.nfcError = action.payload || "Failed to update Tag";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })

      // Delete Tag
      .addCase(deleteNfcTag.pending, (state) => {
        state.loading = true;
        state.nfcError = null;
      })
      .addCase(deleteNfcTag.fulfilled, (state, action) => {
        state.loading = false;
        state.nfcTags = action.payload?.data;   
        toast.success(action.payload.message || "Tag deleted successfully")
      })
      .addCase(deleteNfcTag.rejected, (state, action) => {
        state.loading = false;
        state.nfcError = action.payload || "Failed to Delete Tag";
        toast.error("Failed to Delete Tag")
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      });
  },
});

export default nfcTagSlice.reducer;
