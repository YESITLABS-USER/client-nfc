import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// Async thunks
function logouterror() {
  toast.error("Token Expired");
  localStorage.removeItem("nfc-admin");
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
}
// Get All Clients
export const getAllClients = createAsyncThunk(
  "/client/getAllclient",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllClient();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getClientUniqueId = createAsyncThunk(
  "/client/getClientUniqueId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getClientUniqueId();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getLocationUniqueId = createAsyncThunk(
  "/client/getLocationUniqueId",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getClientUniqueId();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create Client

export const addClient = createAsyncThunk(
  "/client/addClient",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.addClient(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update Client

export const updateClient = createAsyncThunk(
  "/client/updateClient",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.updatedClient(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit client
export const editclient = createAsyncThunk(
  "/client/editclient",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.editclient(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Delete client
export const updatedLandingStatus = createAsyncThunk(
  "/client/updatedLandingStatus",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.updatedLandingStatus(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteClient = createAsyncThunk(
  "/client/delete",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.deleteClient(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Get all client templates
export const getAllClientTemplates = createAsyncThunk(
  "/client/get-all-client-template",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllClientTemplates();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Create template
export const createClientTemplate = createAsyncThunk(
  "/client/create-client-template",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.createClientTemplate(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
export const getClientCampaign = createAsyncThunk(
  "/client/getClientCampaign",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getClientCampaign(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const UpdateClientCampaignStatus = createAsyncThunk(
  "client/campaign/UpdateClientCampaignStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.UpdateCampaignStatus(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Tag
export const deleteClientCampaign = createAsyncThunk(
  "/campaign/delete",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.deleteCampaign(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const clientSlice = createSlice({
  name: "client_slice",
  initialState: {
    clients: [],
    templates: [],
    clientCampaign: [],
    loading: false,
    error: null,
    message: null,
    clientIdAndUrl: null,
    uniqueLocationId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Clients
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload?.data;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch clients";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // Get client unique Id
      .addCase(getClientUniqueId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientUniqueId.fulfilled, (state, action) => {
        state.loading = false;
        state.clientIdAndUrl = action.payload?.data;
      })
      .addCase(getClientUniqueId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch clients";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Get Location unique Id
      .addCase(getLocationUniqueId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocationUniqueId.fulfilled, (state, action) => {
        state.loading = false;
        state.uniqueLocationId = action.payload?.data;
      })
      .addCase(getLocationUniqueId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch clients";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Get all Client Templates
      .addCase(getAllClientTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClientTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(getAllClientTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch templates";
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // Create Client
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Client created successfully";
        toast.success(action.payload.message || "Client created successfully");
        window.location.href = "/client-management";
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Client creation failed";
        toast.error(action.payload.message || "Client creation failed");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload?.data;
        state.message = "Client updated successfully";
        toast.success(action.payload.message || "Client updated successfully");
        window.location.href = "/client-management";
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Client creation failed";
        toast.error(action.payload?.errors || "Client creation failed");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // update Landing Page Status
      .addCase(updatedLandingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedLandingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload?.data;
        state.message = "Landing Page updated successfully";
        toast.success("Landing Page updated successfully");
      })
      .addCase(updatedLandingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update client status";
        toast.error("Failed to update client status");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload?.data;
        state.message = "Client deleted successfully";
        toast.success(action.payload.message || "Client deleted successfully");
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete client";
        toast.error(action.payload.message || "Failed to delete client");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      .addCase(createClientTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClientTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
        state.message = "Client template created successfully";
        toast.success(
          action.payload.message || "Client template created successfully"
        );
      })
      .addCase(createClientTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Client creation failed";
        toast.error(action.payload.message || "Failed to create Templete");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      .addCase(getClientCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.clientCampaign = action.payload?.data;
        state.message = "Client campaign fetch successfully";
      })
      .addCase(getClientCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.errors || "Client campaign fetch failed";
        toast.error(
          action.payload.message || "Failed to Client campaign fetch"
        );
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // Update status Campaign
      .addCase(UpdateClientCampaignStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateClientCampaignStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.clientCampaign = action.payload?.data;
        toast.success("Status update successfully");
      })
      .addCase(UpdateClientCampaignStatus.rejected, (state, action) => {
        state.loading = false;
        toast.error("Failed to update status");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // delete client campaign
      .addCase(deleteClientCampaign.pending, (state) => {
        state.loading = true;
        state.campaignError = null;
      })
      .addCase(deleteClientCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.clientCampaign = action.payload?.data;
        state.message = "Campaign deleted successfully";
        toast.success(
          action.payload.message || "Campaign deleted successfully"
        );
      })
      .addCase(deleteClientCampaign.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message || "Failed to delete campaign");
        if (action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      });
  },
});

export default clientSlice.reducer;
