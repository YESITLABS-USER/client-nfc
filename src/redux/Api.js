import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const login = (formData) => API.post("/api/login", formData);

export const logout = (id) => API.post('/api/logout', id, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
  }
});

// export const forgetpassword = (formData) => API.post('/forgot-password', formData);

// export const resetPassword = (formData) => API.post('/reset-password', formData);

// export const profileView = (id) => API.get(`/${id}`, { headers: {
//   'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
// }});

// export const updateUserProfile = ({formData, id}) => API.put(`/${id}`, formData, { 
//   headers: {
//     'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
//     'Content-Type': 'multipart/form-data',
//   },
// });

// ------------------------------ User Slice APi -----------------------------------------------

export const getAllUser = () => API.post(`/api/get-all-users`,{},  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
  
});

export const getUserId = () => API.get(`/api/user-id-and-url`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const createUser = (formData) => API.post(`/api/create-new-user`, formData, { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const editUser = (formData) => API.post(`/api/edit-user`, formData, { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const deleteUser = (formData) => API.post(`/api/delete-user`, formData, { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

// ------------------------------ Client Slice APi -----------------------------------------------
export const getAllClient = () => API.post(`/api/get-all-clients`, { "lang": "eng" }, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },

});

export const getAllClientTemplates = () => API.post(`/api/get-all-client-template`, { "lang": "eng" }, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },

});
export const getClientUniqueId = () => API.post(`/api/client-unique-id`, { "lang": "eng" }, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },

});

export const addClient = (formData) => {
  return API.post("/api/create-new-client", formData, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
      "Content-Type": "multipart/form-data",
      'lang': localStorage.getItem("language") || "eng",
    },
  });
};

export const updatedClient = (formData) => {
  return API.post("/api/update-client", formData, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
      "Content-Type": "multipart/form-data",
      'lang': localStorage.getItem("language") || "eng",
    },
  });
};

export const updatedLandingStatus = (formData) => {
  return API.post("/api/landing-page-status", formData, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
      "Content-Type": "multipart/form-data",
      'lang': localStorage.getItem("language") || "eng",
    },
  });
};


export const deleteClient = (formData) => {
  return API.post("/api/delete-client", formData, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
      "Content-Type": "multipart/form-data",
      'lang': localStorage.getItem("language") || "eng",
    },
  });
};

export const createClientTemplate = (formData) => {
  return API.post("/api/create-client-template", formData, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
      "Content-Type": "multipart/form-data",
      'lang': localStorage.getItem("language") || "eng",
    },
  });
};

export const getClientCampaign = (formData) => {
  return API.post("/api/get-campaign-details", formData, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
      'lang': localStorage.getItem("language") || "eng",
    },
  });
};


// ---------------------------------- NFC Tag Api -----------------------------------------------


export const getAllNfcTags = () => API.get(`/api/tags/get-all-tags`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const getAllClients = () => API.get(`/api/tags/get-all-client`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const getAllLocations = (formData) => API.post(`/api/tags/get-all-location`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const createNfcTag = (formData) => API.post(`/api/tags/create-tages`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const editNfcTag = (formData) => API.post(`/api/tags/update-tags`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const deleteNfcTag = (formData) => API.post(`/api/tags/delete-tags`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

// ---------------------------------- About Tagis Api -----------------------------------------------

export const getAboutTagis = () => API.get(`/api/get-aboutus`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const editAboutTagis = (formData) => API.post(`/api/update-aboutus`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
// ---------------------------------- About Services Api -----------------------------------------------

export const getAboutServices = () => API.get(`/api/get-about-services`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const editAboutServices = (formData) => API.post(`/api/update-about-services`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

// ---------------------------------- Terms and Condition and Privacy Api --------------------------------

export const getTermsAndPrivacy = () => API.get(`/api/get-t-and-c-and-privacy-policy`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const editTermsAndPrivacy = (formData) => API.post(`/api/update-t-and-c-and-privacy-policy`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

// ---------------------------------- Contact Api --------------------------------

export const getAllContacts = () => API.get(`/api/get-all-contct`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const updateFeedback = (formData) => API.post(`/api/change-feedback-status`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
export const deleteContact = (formData) => API.post(`/api/delete-contct`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

// ---------------------------------- FAQ Api --------------------------------

export const getAllFaq = () => API.get(`/api/get-all-faq`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const createFaq = (formData) => API.post(`/api/save-faq`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
export const editFaq = (formData) => API.post(`/api/update-faq`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
export const deleteFaq = (formData) => API.post(`/api/delete-faq`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})


// ---------------------------------- Loyality Api --------------------------------------------------------


export const getAllLoyalityCards = () => API.get(`/api/loyalty-card/get-all-loyalty-card`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const getLoyalityUniqueId = () => API.get(`/api/loyalty-card/unique-id`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const getAllCampaignLoyality = (formData) => API.post(`/api/loyalty-card/get-all-campaign-name`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
export const UpdateLoyalityCardStatus = (formData) => API.post(`/api/loyalty-card/loyalty-card-status`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const createLoyality = (formData) => API.post(`/api/loyalty-card/loyalty-card-create`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const editLoyality = (formData) => API.post(`/api/loyalty-card/loyalty-card-update`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const deleteLoyalityCard = (formData) => API.post(`/api/loyalty-card/loyalty-card-delete`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})


// ---------------------------------- Campaign Api ---------------------------------------------------------

export const getAllCampaign = () => API.get(`/api/campaign/get-campaign`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});


export const getCampaignId = () => API.get(`/api/campaign/unique-id`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const getAllTags = (formData) => API.post(`/api/campaign/get-all-tags`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
export const createCampaign = (formData) => API.post(`/api/campaign/create-campaign`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
    "Content-Type": "multipart/form-data",
  },
})

export const editCampaign = (formData) => API.post(`/api/campaign/update-campaign`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
    "Content-Type": "multipart/form-data",
  },
})
export const UpdateCampaignStatus = (formData) => API.post(`/api/campaign/status`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const deleteCampaign = (formData) => API.post(`/api/campaign/delete-campaign`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})


export const getAllCampaignTemplate = () => API.get(`/api/campaign/get-all-campaign-template`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const createCampaignTemplate = (formData) => API.post(`/api/campaign/create-campaign-template`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
    "Content-Type": "multipart/form-data",
  },
})

export const getSelectedNfc = (formData) => API.post(`/api/campaign/get-all-tags`, formData, { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});
// ---------------------------------- Coupans Api ---------------------------------------------------------

export const getAllCoupans = () => API.get(`/api/coupon/get-coupon`,  { 
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
});

export const createCoupan = (formData) => API.post(`/api/coupon/create-coupon`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
    "Content-Type": "multipart/form-data",
  },
})

export const editCoupan = (formData) => API.post(`/api/coupon/update-coupon`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
    "Content-Type": "multipart/form-data",
  },
})
export const UpdateCoupanStatus = (formData) => API.post(`/api/coupon/change-status`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})

export const deleteCoupan = (formData) => API.post(`/api/coupon/delete-coupon`, formData, {
  headers: {
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("nfc-admin"))?.token}`,
    'lang': localStorage.getItem("language") || "eng",
  },
})
