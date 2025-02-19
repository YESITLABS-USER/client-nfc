import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// For Unauthenticated Tag
function logouterror() {
  toast.error("Token Expired");
  localStorage.removeItem("nfc-admin");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}
// Get All Campaigns
export const getAllCoupans = createAsyncThunk("/coupans/getAllCoupans",async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCoupans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCoupan = createAsyncThunk("/coupans/createCoupan",async (formData, { rejectWithValue }) => {
    try {
      const response = await api.createCoupan(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Coupan status
export const UpdateCoupanStatus = createAsyncThunk("/coupans/UpdateCoupanStatus",async (id, { rejectWithValue }) => {
    try {
      const response = await api.UpdateCoupanStatus(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Coupan
export const deleteCoupan = createAsyncThunk("/coupans/deleteCoupan",async (TagData, { rejectWithValue }) => {
    try {
      const response = await api.deleteCoupan(TagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Edit Tag
export const editCoupan = createAsyncThunk("/coupans/editCoupan",async (formData, { rejectWithValue }) => {
    try {
      const response = await api.editCoupan(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// // Slice

const coupanSlice = createSlice({
  name: "coupan",
  initialState: {
    allCoupans: [],
    nfcTags: [],
    nfcTagsClient: [],
    allClients: [],
    allClientLocation: [],
    uniqueCampaignId: "",
    loading: false,
    client_loading: false,
    location_loading: false,
    campaignError: null,
    message: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Coupans
      .addCase(getAllCoupans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupans.fulfilled, (state, action) => {
        state.loading = false;
        state.allCoupans = action.payload?.data;
      })
      .addCase(getAllCoupans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch Coupans";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Create Coupan
      .addCase(createCoupan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupan.fulfilled, (state, action) => {
        state.loading = false;
        state.allCoupans = action.payload?.data;
        state.message =
          action.payload?.message || "Coupan created successfully";
        toast.success("Coupan created successfully");
        setTimeout(() => {
          window.location.href = "/coupons-management";
        }, 1000);
      })
      .addCase(createCoupan.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.error =
          action.payload?.errors || "Coupan creation failed";
        toast.error(action.payload.message || "Coupan creation failed");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Edit Tag
      .addCase(editCoupan.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(editCoupan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload || "Coupan updated successfully";
        toast.success("Coupan updated successfully");
        setTimeout(() => {
          window.location.href = "/coupons-management";
        }, 1000);
      })
      .addCase(editCoupan.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || "Failed to update coupan";
        toast.error(action.payload.message || "Failed to update coupan");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Update Coupan status 
      .addCase(UpdateCoupanStatus.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(UpdateCoupanStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.allCoupans = action.payload?.data;
        toast.success("Status updated successfully");
      })
      .addCase(UpdateCoupanStatus.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to update status";
        toast.error("Failed to update status");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Delete Coupan
      .addCase(deleteCoupan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupan.fulfilled, (state, action) => {
        state.loading = false;
        state.allCoupans = action.payload?.data;
        state.message = "Coupan deleted successfully";
        toast.success(action.payload.message || "Coupan deleted successfully");
      })
      .addCase(deleteCoupan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete coupan";
        toast.error(action.payload.message || "Failed to delete coupan");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });


  },
});

export default coupanSlice.reducer;
