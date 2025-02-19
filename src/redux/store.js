"use client"
import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./slices/adminSlice.js";
import clientsSlice from "./slices/clientSlice.js"
import userSlice from "./slices/userSlice.js";
import aboutTagisSlice from "./slices/aboutTagisSlice.js";
import aboutServicesSlice from "./slices/aboutServicesSlice.js"
import faqSlice from "./slices/faqSlice.js";
import TermsAndPrivacySlice from "./slices/TermsAndPrivacySlice.js";
import nfcTagSlice from "./slices/nfcTagSlice.js";
import campaignSlice from "./slices/campaignSlice.js";
import coupanSlice from "./slices/coupanSlice.js";
import LoyalitySlice from "./slices/loyalitySlice.js";

const store = configureStore({
    reducer: {
        admin : adminSlice,
        clients: clientsSlice,
        user : userSlice,
        campaign: campaignSlice,
        coupans: coupanSlice,
        loyality : LoyalitySlice,
        nfcTag : nfcTagSlice,
        aboutTagis: aboutTagisSlice,
        aboutServices: aboutServicesSlice,
        faqs : faqSlice,
        termsAndPrivacy: TermsAndPrivacySlice
    },
    devTools: true
})

export default store;