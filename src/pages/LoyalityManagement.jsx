import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "../components/SearchDropdown";
import HideShow from "../components/HideShow";
import { Modal } from "react-bootstrap";
import DeletePopup from "../components/DeletePopup";
import { useDispatch, useSelector } from "react-redux";
import { getAllLoyalityCards,deleteLoyalityCard, UpdateLoyalityCardStatus } from "../redux/slices/loyalitySlice";
import { formatDate } from "../assets/common";

const LoyalityManagement = () => {
  const dispatch = useDispatch();
  const { loyalities, loading } = useSelector((state) => state.loyality)

  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showCampaignInput, setShowCampaignInput] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentDeleteData, setCurrentDeleteData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  useEffect(() => {
    dispatch(getAllLoyalityCards());
  }, [dispatch])

  useEffect(() => {
    if(loyalities){
      setFilteredData(loyalities);
    }
  },[loyalities])

  const navigate = useNavigate();

  const handleDeleteShow = (modalData) => {
    setCurrentDeleteData(modalData);
    setShowDeleteModal(true);
  };

  const handleClose = () => {
    setShowDeleteModal(false);
    setCurrentDeleteData(null);
  };

  const handleDelete = () => {
    if (currentDeleteData) {
      dispatch(deleteLoyalityCard({id: currentDeleteData}));
    }
    handleClose();
  };

  const handleImageClose = () => setShowImageModal(false);
  const handleShowImage = (image) => {
    setCurrentImage(image);
    setShowImageModal(true);
  };

  const handleLocationSearchValue = (searchValue) => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      setFilteredData(
        loyalities.filter((item) =>
          item?.client_location.toLowerCase().includes(trimmedValue.toLowerCase())
        )
      );
    } else {
      setFilteredData(loyalities);
    }
  };

  const handleSearchValue = (searchValue) => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      setFilteredData(
        loyalities.filter((item) =>
          item?.campaign_name.toLowerCase().includes(trimmedValue.toLowerCase()) ||
          item?.campaign_id.toLowerCase().includes(trimmedValue.toLowerCase())
        )
      );
    } else {
      setFilteredData(loyalities);
    }
  };

  const updateHideShowStatus = (updatedStatus) => {
    dispatch(UpdateLoyalityCardStatus({id: updatedStatus?.id}));
    // setCurrentData((prevCampaigns) =>
    //   prevCampaigns.map((data) =>
    //     data.id === updatedStatus.id
    //       ? { ...data, status: updatedStatus.status }
    //       : data
    //   )
    // );
  };

  const handleGlobalSearch = (value) => {
    const lowerCaseSearchText = value.toLowerCase();
    const filtered = loyalities.filter((item) => {
      return Object.values(item)
        .filter((value) => typeof value === "string" || typeof value === "number") // Filter out non-searchable types
        .join(" ")
        .toLowerCase()
        .includes(lowerCaseSearchText);
    });
    setFilteredData(filtered);
  };

  const handleCancelGlobalSearch = () => {
    setFilteredData(loyalities); // Reset to original data
  };

  return (
    <main>
      <div className="dashboard-wrap">
        <div className="influ-strip-2">
          <form>
            <div className="influ-search"> 
              <label>
                <input type="text" placeholder="Search"
                  onKeyDown={(e) => { if (e.key === "Enter") { handleGlobalSearch(e.target.value); } }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.trim()) { handleGlobalSearch(value); }
                      else { handleCancelGlobalSearch(e.target.value); }
                    }} />
                <button>
                  <img src="/images/menu-icons/search-icon.png" alt="" />
                </button>
              </label>
            </div>
            <div className="influ-btns">
              {/* For Client Loaction Search */}
              <SearchDropdown 
                label="Client Location"
                isOpen={showLocationInput}
                setIsOpen={setShowLocationInput}
                onSearchChange={handleLocationSearchValue}
              />
              {/* For Campaign Loaction Search */}
              <SearchDropdown 
                label="Campaign filter"
                isOpen={showCampaignInput}
                setIsOpen={setShowCampaignInput}
                onSearchChange={handleSearchValue}
              />

              <button type="button" className="influ-btn" id="create-loyalty" onClick={() => navigate('/loyalty-cards-management/create-loyality-card')}>
                Create Loyality Card
              </button>
            </div>
          </form>
        </div>
        <div className="influ-table">
          <div id="table-responsive-1" className="table-responsive">
            <table>
              <tbody>
                <tr>
                  <th>Sr no</th>
                  <th>Loyalty Card Name</th>
                  <th>Loyalty ID</th>
                  <th>Client name</th>
                  <th>Client location</th>
                  <th>Campaign name</th>
                  <th>Campaign ID</th>
                  <th>Campaign Status</th>
                  <th>Number of stamps</th>
                  <th>Free item Name</th>
                  <th>Free item logo</th>
                  <th>Expiration Date</th>
                  <th>Loyality card status</th>
                  <th>Action</th>
                </tr>
                {currentData.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ padding: "40px 0", fontWeight: "bold", fontSize: "30px",}}>
                        No data found
                      </td>
                    </tr>
                  )}

                {currentData.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.serial_number}</td>
                    <td>{item?.loyalty_card_name}</td>
                    <td>{item?.loyalty_card_id}</td>
                    <td>{item?.client_name}</td>
                    <td>{item?.client_location}</td>
                    <td>{item?.campaign_name}</td>
                    <td>{item?.campaign_id}</td>
                    <td>{item?.campaign_status ? "Active" : "Deactive"}</td>
                    <td>{item?.number_of_stamps}</td>
                    <td>{item?.free_items}</td>
                    <td>
                      <a style={{ color: "#2C0186" }} onClick={() => handleShowImage(item?.free_item_logo)}>
                        View
                      </a>
                    </td>
                    <td>{formatDate(item?.expiration_date) ?? "NO EXPIRATION"}</td>
                    <HideShow item={{ id: item?.id, status: item?.status, name: "Loyality card status" }}
                      updateHideShowStatus={updateHideShowStatus} 
                      />
                    <td>
                      <div className="social-action-wrap">
                        <a style={{ cursor: 'pointer' }} onClick={() => navigate('/loyalty-cards-management/edit-loyality-card', { state: { data: item } })}>
                          <img src="/images/menu-icons/edit-icon.svg" alt="" />
                        </a>
                        <a style={{ cursor: 'pointer' }}>
                          <img src="/images/menu-icons/delete-icon.svg" alt="" onClick={() => handleDeleteShow(item?.id)}/>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}                
              </tbody>
            </table>
          </div>
          <Pagination
            data={filteredData}
            itemsPerPageOptions={[10, 50, 100, 150, 250, "all"]}
            onPageDataChange={setCurrentData}
          />
        </div>
      </div>
      <ShowImageModal
        show={showImageModal}
        handleImageClose={handleImageClose}
        title="Free item Logo"
        imageUrl={currentImage} 
      />
      <DeletePopup
        show={showDeleteModal}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalData={currentDeleteData}
      />
    </main>
  );
};

export default LoyalityManagement;

const ShowImageModal = ({ show, handleImageClose, title, imageUrl }) => {
  return (
    <Modal show={show} onHide={handleImageClose}>
      <Modal.Body style={{position:'relative'}}>
        <img src="/images/menu-icons/close-popup-icon.svg" alt="Close" onClick={handleImageClose} style={{position:'absolute', right:'10px', top:'10px', cursor:'pointer'}} />

        <div className="logout-pop-wrap">
          <h2>{title}</h2>
        </div>
        <div className="business-logo-img">
          <img src={`${import.meta.env.VITE_BACKEND_URL}/free_item_logo/${imageUrl}`} alt="Business Photo" style={{width:'100%'}} />
        </div>
        </Modal.Body>
    </Modal>
  );
};