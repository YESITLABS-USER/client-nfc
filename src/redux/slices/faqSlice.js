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
// ------------------------ Contact us and FAQ APi ------------------------------------------------

// Contact us
export const getAllContacts = createAsyncThunk("faq/getAllContacts", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllContacts();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


export const updateFeedback = createAsyncThunk("faq/updateFeedback", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFeedback(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteContact = createAsyncThunk("faq/deleteContact", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.deleteContact(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

//  FAQ API
export const getAllFaq = createAsyncThunk("faq/getAllFaq", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllFaq();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
 
export const createFaq = createAsyncThunk("faq/createFaq", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.createFaq(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const editFaq = createAsyncThunk("faq/editFaq", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.editFaq(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteFaq = createAsyncThunk("faq/deleteFaq", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.deleteFaq(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const faqSlice = createSlice({
  name: "faqSlice",
  initialState: {
    allContacts:[],
    contactLoading: false,
    contactError: null,
    allFaq: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Contacts
      .addCase(getAllContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.allContacts = action.payload?.data;

      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch Contacts";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
    
      // update Feedback Contact
      .addCase(updateFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.allContacts = action.payload?.data;  
        toast.success("Feedback updated successfully")
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update Contacts";
        toast.error(action.payload.message || "Failed to update Feedback")
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

    //   Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false;
        state.allContacts = action.payload.data;  
        toast.success("Contact deleted successfully")
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete Faq";
        toast.error(action.payload.message || "Failed to delete Faq")
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

//   ---------------------------------- FAQ -----------------------
      // Get all FAQ
      .addCase(getAllFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.allFaq = action.payload?.data;

      })
      .addCase(getAllFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch Faq's";
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })

      // create FAQ
      .addCase(createFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.allFaq = action.payload?.data;
        toast.success("Faq created successfully")
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch Faq's";
        toast.error(action.payload.message || "Failed to create Faq")
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
    
      // Edit FAQ
      .addCase(editFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.allFaq = action.payload.data;  
        state.message = "Faq updated successfully"; 
        toast.success("Faq updated successfully")
      })
      .addCase(editFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update Faq";
        toast.error(action.payload.message || "Failed to update Faq")
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      // Delete FAQ
      .addCase(deleteFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.allFaq = action.payload.data;  
        state.message = "Faq deleted successfully"; 
        toast.success("Faq deleted successfully")
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete Faq";
        toast.error(action.payload.message || "Failed to delete Faq")
        if(action.payload.message == "Unauthenticated.") {
          logouterror();
        }
      })
  },
});

export default faqSlice.reducer;
