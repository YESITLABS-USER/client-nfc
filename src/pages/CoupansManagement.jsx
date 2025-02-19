import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import SearchDropdown from "../components/SearchDropdown";
import HideShow from "../components/HideShow";
import DeletePopup from "../components/DeletePopup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCoupan, getAllCoupans, UpdateCoupanStatus } from "../redux/slices/coupanSlice";
import { formatDate } from "../assets/common";
import { Modal } from "react-bootstrap";


const CoupansManagement = () => {
  const dispatch = useDispatch();
  const { allCoupans } = useSelector((state) => state.coupans)

  const [filteredData, setFilteredData] = useState([]);
  const [currentData, setCurrentData] = useState([]); // For the current user data displayed
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showCampaignInput, setShowCampaignInput] = useState(false);

  const [currentDeleteData, setCurrentDeleteData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [currentModalData, setCurrentModalData] = useState({});
    const [showCustomModal, setCustomModal] = useState(false)
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(getAllCoupans());
  }, [dispatch]);
  
  useEffect(() => {
    if(allCoupans){
      setFilteredData(allCoupans);
    }
  },[allCoupans])

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
        dispatch(deleteCoupan({id: currentDeleteData}))
        // setFilteredData((prevData) =>
        //   prevData.filter((item) => item?.id !== currentDeleteData)
        // );
      }
      handleClose(); 
    };

    const handleCustomShow = (modalData) => {
      setCurrentModalData(modalData);
      setCustomModal(true);
    };
    
    const handleCustomClose = () => {
      setCustomModal(false)
      setCurrentModalData(null);
    };

  const handleLocationSearchValue = (data) => {
    const searchData = data.trim();
    if (searchData) {
      setFilteredData(
        currentData.filter((item) => item?.client_location.toLowerCase().includes(searchData.toLowerCase())) );
     } else { setFilteredData(allCoupans); 
    }};

    const handleCampaignSearchValue = (data) => {
      const searchData = data.trim();
      if (searchData) {
        setFilteredData(
          currentData.filter((item) => item?.campaign_name.toLowerCase().includes(searchData.toLowerCase())) );
       } else { setFilteredData(allCoupans); 
      }
    };

  const updateHideShowStatus = (updatedStatus) => {
    dispatch(UpdateCoupanStatus({id: updatedStatus?.id}));
    // setCurrentData((prevCampaigns) =>
    //   prevCampaigns.map((data) =>
    //     data.id === updatedStatus.id ? { ...data, status: updatedStatus.status } : data )
    // );
  };

  const handleGlobalSearch = (value) => {
    const lowerCaseSearchText = value.toLowerCase();
    const filtered = currentData.filter((item) => {
      return Object.values(item)
        .filter((value) => typeof value === "string" || typeof value === "number") // Filter out non-searchable types
        .join(" ")
        .toLowerCase()
        .includes(lowerCaseSearchText);
    });
    setFilteredData(filtered);
  };

  const handleCancelGlobalSearch = () => {
    setFilteredData(allCoupans); // Reset to original data
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
                <button> <img src="/images/menu-icons/search-icon.png" alt="" /> </button>
              </label>
            </div>
            <div className="influ-btns">
              
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
                onSearchChange={handleCampaignSearchValue}
              />
              <button type="button" className="influ-btn" id="create-coupon" onClick={() => navigate("/coupons-management/create-coupon")}>
                Create New Coupons
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
                  <th>Coupon Name</th>
                  <th>Coupon ID</th>
                  <th>Client name</th>
                  <th>Client location</th>
                  <th>Campaign name</th>
                  <th>Campaign ID</th>
                  <th>Campaign Status</th>
                  <th>Coupon Type:</th>
                  <th>Enter value (€)</th>
                  <th>Product restrictions</th>
                  <th>Usage limit</th>
                  <th>Select time unit</th>
                  <th>Expiration Date</th>
                  <th>Other customization</th>
                  <th>Coupons status</th>
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
                        <td>{item?.serial_number}.</td>
                        <td>{item?.coupon_name}</td>
                        <td>{item?.coupon_id}</td>
                        <td>{item?.client_name?.slice(0,10)}</td>
                        <td>{item?.location_name}</td>
                        <td>{item?.campaign_name}</td>
                        <td>{item?.campaign_id}</td>
                        <td>{item?.campaign_status ? "Active" : "Deactive"}</td>
                        <td>{item?.coupon_type}</td>
                        <td>{item?.value}</td>
                        <td>
                          <a href="" className="modal-trigger"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCustomShow({
                                id: "business-aboutus",
                                title: "Product Restrictions",
                                contentType: "text",
                                textContent: item?.product_restrictions,
                                contentClassName: "business-about-us",
                              });
                            }} >
                            View
                          </a>
                        </td>
                        <td>{item?.usages_limit_no_limit ? "No Limit" : item?.usages_limit_select_number}</td>
                        <td>{item?.validity_select_time_unit}</td>
                        <td>{item?.validity_expiration_date ?  formatDate(item?.validity_expiration_date) : "No-Expiration"}</td>
                        <td>
                          <a href="" className="modal-trigger"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCustomShow({
                                id: "business-aboutus",
                                title: "Other Customizations",
                                contentType: "text",
                                textContent: item?.other_customization,
                                contentClassName: "business-about-us",
                              });
                            }} >
                            View
                          </a>
                        </td>

                        <HideShow 
                          item={{ id: item?.id, status: item?.is_publish, name:"coupons status" }}
                          updateHideShowStatus={updateHideShowStatus}
                        />
                        <td>
                          <div className="social-action-wrap">
                            <a style={{cursor:'pointer'}} onClick={() => navigate("/coupons-management/edit-coupon", { state: { data: item } })}>
                              <img src="/images/menu-icons/edit-icon.svg" alt="edit" />
                            </a> 
                            <a style={{cursor:'pointer'}} onClick={()=> handleDeleteShow(item?.id)} >
                              <img src="/images/menu-icons/delete-icon.svg" alt="delete"/>
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
      <DeletePopup
        show={showDeleteModal}
        handleClose={handleClose}
        handleDelete={handleDelete}
        modalData={currentDeleteData}
      />
      <CustomModal
        show={showCustomModal}
        handleClose={handleCustomClose}
        modalData={currentModalData}
      />
    </main>
  );
};

export default CoupansManagement;


const CustomModal = ({ show, handleClose, modalData }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="modal fade"
      id={modalData?.id}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog-edit" role="document">
        <div className="modal-content clearfix">
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            >
              <img src="/images/menu-icons/close-popup-icon.svg" alt="Close" />
            </button>
          </div>
          <div className="modal-body">
            <div className="logout-pop-wrap">
              <h2>{modalData?.title}</h2>
            </div>
            {modalData?.contentType === "image" && (
              <div className="business-logo-img">
                <img src={modalData.imageSrc ? `${import.meta.env.VITE_BACKEND_URL}/${modalData.imageSrc}` : noImage}
                  alt={modalData?.title || "no image availabel"} style={{maxWidth:'200px'}}
                />
              </div>
            )}
            {modalData?.contentType === "text" && (
              <div className={modalData?.contentClassName}>
                <p>{modalData?.textContent}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
