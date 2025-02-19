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
export const getAllCampaign = createAsyncThunk("/campaign/getAllCampaign",async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllCampaign();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get All NFC Tags
export const getAllNfcTags = createAsyncThunk("/campaign/getAllNfcTags",async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllNfcTags();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Get unique campaign id
export const getCampaignId = createAsyncThunk("/campaign/unique-id",async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCampaignId();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Get all nfc tags
export const getNfcTagsForClient = createAsyncThunk("/campaign/get-all-tags",async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getAllTags(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllClients = createAsyncThunk("/campaign/getAllClients",async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllClients();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAllLocations = createAsyncThunk("/campaign/getAllLocations",async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getAllLocations(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const createCampaign = createAsyncThunk("/campaign/create",async (formData, { rejectWithValue }) => {
    try {
      const response = await api.createCampaign(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit Tag
export const editCampaign = createAsyncThunk("/campaign/editCampaign",async (formData, { rejectWithValue }) => {
    try {
      const response = await api.editCampaign(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update campaign status
export const UpdateCampaignStatus = createAsyncThunk("/campaign/UpdateCampaignStatus",async (id, { rejectWithValue }) => {
    try {
      const response = await api.UpdateCampaignStatus(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Tag
export const deleteCampaign = createAsyncThunk("/campaign/delete",async (TagData, { rejectWithValue }) => {
    try {
      const response = await api.deleteCampaign(TagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get All Campaigns
export const getAllCampaignTemplate = createAsyncThunk("/campaign/getAllCampaignTemplate",async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllCampaignTemplate();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);

// Template
export const createCampaignTemplate = createAsyncThunk("/campaign/createCampaignTemplate",async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createCampaignTemplate(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);

// Get All Campaigns
export const getSelectedNfc = createAsyncThunk("/campaign/getSelectedNfc",async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getSelectedNfc(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);


const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    nfcTags: [],
    nfcTagsClient: [],
    allClients: [],
    allClientLocation: [],
    allCampaigns: [],
    allCampaignTemplates: [],
    tableNfcTags: [],
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
      // Get all Campaigns
      .addCase(getAllCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaigns = action.payload?.data;
      })
      .addCase(getAllCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Get all Tags
      .addCase(getAllNfcTags.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getAllNfcTags.fulfilled, (state, action) => {
        state.loading = false;
        state.nfcTags = action.payload?.data;
      })
      .addCase(getAllNfcTags.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Get all Tags
      .addCase(getNfcTagsForClient.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getNfcTagsForClient.fulfilled, (state, action) => {
        state.loading = false;
        state.nfcTagsClient = action.payload?.data;
      })
      .addCase(getNfcTagsForClient.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Get client id
      .addCase(getCampaignId.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getCampaignId.fulfilled, (state, action) => {
        state.loading = false;
        state.uniqueCampaignId = action.payload?.data?.campaign_id;
      })
      .addCase(getCampaignId.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      //   Get All Clients
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.allClients = action.payload?.data;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      //   Get All locations
      .addCase(getAllLocations.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.allClientLocation = action.payload?.data;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.message =
          action.payload?.message || "Campaign created successfully";
        toast.success("Campaign created successfully");
        setTimeout(() => {
          window.location.href = "/campaign-management";
        }, 1000);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.campaignError = action.payload?.errors || "Tag creation failed";
        toast.error(action.payload.message || "Tag creation failed");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Edit Tag
      .addCase(editCampaign.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(editCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload || "Campaign updated successfully";
        toast.success("Campaign updated successfully");
        setTimeout(() => {
          window.location.href = "/campaign-management";
        }, 1000);
      })
      .addCase(editCampaign.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload || "Failed to update Campaign";
        toast.error(action.payload.message || "Failed to update Campaign");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Update status Campaign
      .addCase(UpdateCampaignStatus.pending, (state) => {
        state.loading = true;
        state.loyalityError = null;
      })
      .addCase(UpdateCampaignStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaigns = action.payload?.data;
        toast.success("Status Update successfully");
      })
      .addCase(UpdateCampaignStatus.rejected, (state, action) => {
        state.loading = false;
        state.loyalityError = action.payload || "Failed to update status";
        toast.error("Failed to Update Status");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Delete Tag
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaigns = action.payload?.data;
        state.message = "Campaign deleted successfully";
        toast.success(
          action.payload.message || "Campaign deleted successfully"
        );
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to delete campaign";
        toast.error(action.payload.message || "Failed to delete campaign");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      
      // Get All Templates
      .addCase(getAllCampaignTemplate.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getAllCampaignTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaignTemplates = action.payload?.data;
      })
      .addCase(getAllCampaignTemplate.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload || "Failed to fetch tags";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Create Campaign
      .addCase(createCampaignTemplate.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(createCampaignTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.allCampaignTemplates = action.payload?.data;
        state.message = action.payload?.message || "Template created successfully";
        toast.success("Template created successfully");
      })
      .addCase(createCampaignTemplate.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload?.errors || "Tag creation failed";
        toast.error(action.payload.message || "Tag creation failed");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // get Table Nfc Tags
      .addCase(getSelectedNfc.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(getSelectedNfc.fulfilled, (state, action) => {
        state.loading = false;
        state.tableNfcTags = action.payload?.data;
        state.message = action.payload?.message || "Template created successfully";
      })
      .addCase(getSelectedNfc.rejected, (state, action) => {
        state.loading = false;
        state.campaignError = action.payload?.errors || "Tag creation failed";
        toast.error(action.payload?.message || "Error in getting the NFC Tags");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });
  },
});

export default campaignSlice.reducer;
