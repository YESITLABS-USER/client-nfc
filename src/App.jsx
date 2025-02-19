import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import UnderConstruction from './pages/UnderConstruction';
import Sidebar from './components/Sidebar';
import ClientManagement from './pages/ClientManagement';
import UserManagement from './pages/UserManagement';
import CampaignDetails from './pages/CampaignDetails';
import TermsAndPrivacy from './pages/TermsAndPrivacy';
import AboutServices from './pages/AboutServices';
import NotFound from './pages/NotFound';
import ContactFaq from './pages/ContactFaq';
import AboutTagis from './pages/AboutTagis';
import AddClient from './pages/AddClient';
import NFCManagement from './pages/NFCManagement';
import LoyalityManagement from './pages/LoyalityManagement';
import CoupansManagement from './pages/CoupansManagement';
import CampaignManagement from './pages/CampaignManagement';
// import { CreateLoyality, EditLoyality } from './pages/CreateLoyality';
import LoyaltyCardForm from './pages/CreateLoyality';
import CreateEditCoupan from './pages/CreateEditCoupan';
import CreateEditCampaign from './components/CreateEditCampaign';

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};


const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <>
      {!isLoginPage && <Sidebar />} 
      <section id={isLoginPage ? "" : "content"}>
      
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/client-management" element={<ClientManagement />} />
        <Route path="/client-management/add-client" element={<AddClient />} />
        <Route path="/client-management/client-edit/:id" element={<AddClient />} />
        <Route path="/client-management/campaign-detail" element={<CampaignDetails />} />

        <Route path="/user-management" element={<UserManagement />} />

        <Route path="/campaign-management" element={<CampaignManagement />} />
        <Route path="/campaign-management/create-campaign" element={<CreateEditCampaign />} />
        <Route path="/campaign-management/edit-campaign" element={<CreateEditCampaign />} />

        <Route path="/coupons-management" element={<CoupansManagement />} />
        <Route path="/coupons-management/create-coupon" element={<CreateEditCoupan />} />
        <Route path="/coupons-management/edit-coupon" element={<CreateEditCoupan />} />

        <Route path="/loyalty-cards-management" element={<LoyalityManagement />} />
        {/* <Route path="/loyalty-cards-management/create-loyality-card" element={<CreateLoyality />} />
        <Route path="/loyalty-cards-management/edit-loyality-card" element={<EditLoyality />} /> */}

        <Route path="/loyalty-cards-management/create-loyality-card" element={<LoyaltyCardForm />} />
        <Route path="/loyalty-cards-management/edit-loyality-card" element={<LoyaltyCardForm />} />

        <Route path="/nfc-tags-management" element={<NFCManagement />} />
        
        <Route path="/about-tagis" element={<AboutTagis />} />
        <Route path="/about-services" element={<AboutServices />} />
        <Route path="/contact-us-faq" element={<ContactFaq />} />
        <Route path="/t&c-and-privacy-policy" element={<TermsAndPrivacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </section>
    </>
  );
};
export default App;
