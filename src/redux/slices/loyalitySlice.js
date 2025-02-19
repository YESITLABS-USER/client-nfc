import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// For Unauthenticated loyality
function logouterror() {
    toast.error("Token Expired")
    localStorage.removeItem("nfc-admin");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
}
// Get All loyalitys
export const getAllLoyalityCards = createAsyncThunk("loyality/getAllLoyalityCards", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllLoyalityCards();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
export const getAllClients = createAsyncThunk("loyality/getAllClients", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllClients();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const getAllLocations = createAsyncThunk("loyality/getAllLocations", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getAllLocations(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const getAllCampaignLoyality = createAsyncThunk("loyality/getAllCampaignLoyality", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getAllCampaignLoyality(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const getLoyalityUniqueId = createAsyncThunk("loyality/getLoyalityUniqueId", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getLoyalityUniqueId();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const createLoyality = createAsyncThunk("loyality/createLoyality", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createLoyality(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Edit loyality
export const editLoyality = createAsyncThunk("loyality/editLoyality", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editLoyality(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
// Delete loyality
export const UpdateLoyalityCardStatus = createAsyncThunk("loyality/UpdateLoyalityCardStatus", async (loyalityData, { rejectWithValue }) => {
  try {
    const response = await api.UpdateLoyalityCardStatus(loyalityData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteLoyalityCard = createAsyncThunk("loyality/deleteLoyalityCard", async (loyalityData, { rejectWithValue }) => {
  try {
    const response = await api.deleteLoyalityCard(loyalityData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Slice

const loyalitySlice = createSlice({
  name: "Loyality Card",
  initialState: {
    loyalities: [],
    allClients: [],
    allClientLocation: [],
    allCampaigns: [],
    loading: false,
    client_loading: false,
    location_loading: false,
    loyalityError: null,
    message: null,
    loyalityUniqueId: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all loyalitys
      .addCase(getAllLoyalityCards.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(getAllLoyalityCards.fulfilled, (state, action) => {
        state.loading = false;  
        state.loyalities = action.payload?.data;

      })
      .addCase(getAllLoyalityCards.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to fetch loyality's";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })

    //   Get All Clients
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;  
        state.allClients = action.payload?.data;

      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to fetch loyality's";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })
      //   Get All locations
      .addCase(getAllLocations.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.loading = false;  
        state.allClientLocation = action.payload?.data;
        
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to fetch loyality's";
        if(action.payload.message == "Unauthenticated."){
          logouterror();
        }
      })
      //   Get All locations
      .addCase(getAllCampaignLoyality.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(getAllCampaignLoyality.fulfilled, (state, action) => {
        state.loading = false;  
        state.allCampaigns = action.payload?.data; 
      })
      .addCase(getAllCampaignLoyality.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to fetch loyality's";
        if(action.payload.message == "Unauthenticated."){
          logouterror();
        }
      })
      
      //   Get Loyality Unique Id
        .addCase(getLoyalityUniqueId.pending, (state) => {
          state.loading = true;
          state.loyalityError = null;
        })
        .addCase(getLoyalityUniqueId.fulfilled, (state, action) => {
          state.loading = false;  
          state.loyalityUniqueId = action.payload?.data?.loyalty_id;
        })
        .addCase(getLoyalityUniqueId.rejected, (state, action) => {
          state.loading = false;
          state.loyalityError = action.payload || "Failed to fetch loyality's";
          if(action.payload.message == "Unauthenticated."){
            logouterror();
          }
        })

      // Create loyality
      .addCase(createLoyality.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(createLoyality.fulfilled, (state, action) => {
        state.loading = false;
        state.loyalities = action.payload?.data;  
        state.message = "Loyality card created successfully"; 
        toast.success("Loyality card created successfully");
        setTimeout(() => {
          window.location.href = '/loyalty-cards-management';
        }, 1000);

      })
      .addCase(createLoyality.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload?.errors || "Loyality card creation failed";
        toast.error(action.payload.message || "Loyality card creation failed");
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })
      
      // Edit loyality
      .addCase(editLoyality.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(editLoyality.fulfilled, (state, action) => {
        state.loading = false;
        state.loyalities = action.payload?.data;  
        state.message = "Loyality Card updated successfully"; 
        toast.success("Loyality Card updated successfully")
        setTimeout(() => {
          window.location.href = '/loyalty-cards-management';
        }, 1000);
      })
      .addCase(editLoyality.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to update loyality";
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })

      // Update status loyality
      .addCase(UpdateLoyalityCardStatus.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(UpdateLoyalityCardStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.loyalities = action.payload?.data;   
        toast.success(action.payload.message || "Status update successfully")
      })
      .addCase(UpdateLoyalityCardStatus.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to update Status";
        toast.error("Failed to update Status")
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      })
      // Delete loyality
      .addCase(deleteLoyalityCard.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(deleteLoyalityCard.fulfilled, (state, action) => {
        state.loading = false;
        state.loyalities = action.payload?.data;   
        toast.success(action.payload.message || "loyality Card deleted successfully")
      })
      .addCase(deleteLoyalityCard.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to Delete loyality";
        toast.error("Failed to Delete loyality")
        if(action.payload.message == "Unauthenticated."){
            logouterror();
        }
      });
  },
});

export default loyalitySlice.reducer;
